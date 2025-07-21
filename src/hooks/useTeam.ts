"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TeamMember {
  id: string;
  profile_id: string;
  member_name: string;
  role?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  joined_at: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useTeam(profileId?: string) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    if (!profileId) {
      setTeamMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: teamData, error: teamError } = await supabase
        .from('profile_team')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true })
        .order('joined_at', { ascending: true });

      if (teamError) {
        throw new Error(teamError.message);
      }

      setTeamMembers(teamData || []);
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Verify user owns this profile
      if (memberData.profile_id !== user.id) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('profile_team')
        .insert([memberData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTeamMembers(prev => [...prev, data].sort((a, b) => 
        a.display_order - b.display_order || 
        new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
      ));

      return data;
    } catch (err) {
      console.error('Error adding team member:', err);
      throw err;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('profile_team')
        .update(updates)
        .eq('id', id)
        .eq('profile_id', user.id) // Ensure user owns this team member
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTeamMembers(prev => 
        prev.map(member => member.id === id ? { ...member, ...data } : member)
      );

      return data;
    } catch (err) {
      console.error('Error updating team member:', err);
      throw err;
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { error } = await supabase
        .from('profile_team')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id); // Ensure user owns this team member

      if (error) {
        throw new Error(error.message);
      }

      setTeamMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error removing team member:', err);
      throw err;
    }
  };

  const reorderTeamMembers = async (reorderedMembers: TeamMember[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Update display_order for all members
      const updates = reorderedMembers.map((member, index) => ({
        id: member.id,
        display_order: index
      }));

      const { error } = await supabase
        .from('profile_team')
        .upsert(updates.map(update => ({
          id: update.id,
          display_order: update.display_order,
          profile_id: user.id
        })));

      if (error) {
        throw new Error(error.message);
      }

      setTeamMembers(reorderedMembers);
    } catch (err) {
      console.error('Error reordering team members:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [profileId]);

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    reorderTeamMembers,
    refetch: fetchTeam
  };
}