"use client";

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
  SortableContext as SortableContextType,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProfileBlock, ProfileTheme } from '@/types/layout';
import { BlockRenderer } from '@/components/blocks';
import { BLOCK_DEFINITIONS, getDefaultLayout } from '@/lib/blockDefinitions';
import { useMyProfileLayout } from '@/hooks/useProfileLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemePicker } from '@/components/ThemePicker';
import { VariantPreview } from '@/components/VariantPreview';
import { DEFAULT_THEME } from '@/lib/themePresets';

interface ProfileEditorProps {
  profile: any;
  onSave?: (blocks: ProfileBlock[], theme: ProfileTheme) => void;
  onCancel?: () => void;
}

interface SortableBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing: boolean;
  onEdit: (block: ProfileBlock) => void;
  onEditContent: (block: ProfileBlock) => void;
  onDelete: (blockId: string) => void;
}

function SortableBlock({ block, profile, isEditing, onEdit, onEditContent, onDelete }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 z-10 p-2 bg-gray-700/80 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 7h8l-4-4-4 4zm0 10h8l-4 4-4-4zm-6-3v8l-4-4 4-4zm0-10v8l-4-4 4-4z"/>
        </svg>
      </div>

      <BlockRenderer
        block={block}
        profile={profile}
        isEditing={isEditing}
        onEdit={onEdit}
        onEditContent={onEditContent}
        onDelete={onDelete}
        className="group"
      />
    </div>
  );
}

export function ProfileEditor({ profile, onSave, onCancel }: ProfileEditorProps) {
  const { layout, loading, saveLayout } = useMyProfileLayout();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [blocks, setBlocks] = useState<ProfileBlock[]>([]);
  const [theme, setTheme] = useState<ProfileTheme | null>(null);
  const [showVariantEditor, setShowVariantEditor] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ProfileBlock | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize blocks and theme when layout loads
  React.useEffect(() => {
    if (layout) {
      setBlocks(layout.blocks || []);
      setTheme(layout.theme || DEFAULT_THEME);
    } else if (!loading) {
      // Create default layout if none exists
      const defaultBlocks = getDefaultLayout();
      setBlocks(defaultBlocks);
      setTheme(DEFAULT_THEME);
    }
  }, [layout, loading]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleEditBlock = useCallback((block: ProfileBlock) => {
    setEditingBlock(block);
    setShowVariantEditor(true);
  }, []);

  const handleEditContent = useCallback((block: ProfileBlock) => {
    // TODO: Implement content editing modal/form based on block type
    console.log('Edit content for block:', block.type, block.id);
    // This will be expanded to show content editing modals for each block type
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  }, []);

  const handleAddBlock = useCallback((blockType: string) => {
    const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === blockType);
    if (!blockDef) return;

    const newBlock: ProfileBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType as any,
      variant: blockDef.defaultVariant,
      config: {}
    };

    setBlocks((prev) => [...prev, newBlock]);
  }, []);

  const handleSaveVariant = useCallback((blockId: string, variant: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, variant } : block
      )
    );
    setShowVariantEditor(false);
    setEditingBlock(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!theme) return;
    
    setIsSaving(true);
    try {
      const success = await saveLayout(blocks, theme);
      if (success && onSave) {
        onSave(blocks, theme);
      }
    } finally {
      setIsSaving(false);
    }
  }, [blocks, theme, saveLayout, onSave]);

  const activeBlock = activeId ? blocks.find((block) => block.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile editor...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme || DEFAULT_THEME}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Profile Editor</h1>
              <p className="text-gray-400">Customize your profile layout and theme</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tools */}
            <div className="lg:col-span-1 space-y-6">
              {/* Block Library */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Add Blocks</h3>
                <div className="space-y-3">
                  {BLOCK_DEFINITIONS.map((blockDef) => (
                    <button
                      key={blockDef.type}
                      onClick={() => handleAddBlock(blockDef.type)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 text-left"
                    >
                      <span className="text-xl">{blockDef.icon}</span>
                      <div>
                        <div className="text-white font-medium text-sm">{blockDef.name}</div>
                        <div className="text-gray-400 text-xs">{blockDef.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Picker */}
              {theme && (
                <ThemePicker
                  currentTheme={theme}
                  onThemeChange={setTheme}
                />
              )}
            </div>

            {/* Main Editor Area */}
            <div className="lg:col-span-3">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-6">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        profile={profile}
                        isEditing={true}
                        onEdit={handleEditBlock}
                        onEditContent={handleEditContent}
                        onDelete={handleDeleteBlock}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeBlock ? (
                    <BlockRenderer
                      block={activeBlock}
                      profile={profile}
                      isEditing={false}
                      className="opacity-90 rotate-3 scale-105"
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>

              {blocks.length === 0 && (
                <div className="text-center py-16">
                  <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Start Building Your Profile</h3>
                  <p className="text-gray-400 mb-6">Add blocks from the sidebar to customize your profile layout</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Variant Editor Modal */}
        {showVariantEditor && editingBlock && (
          <VariantEditorModal
            block={editingBlock}
            onSave={(variant) => handleSaveVariant(editingBlock.id, variant)}
            onClose={() => {
              setShowVariantEditor(false);
              setEditingBlock(null);
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

// Variant Editor Modal Component
function VariantEditorModal({ 
  block, 
  onSave, 
  onClose 
}: { 
  block: ProfileBlock; 
  onSave: (variant: string) => void; 
  onClose: () => void; 
}) {
  const [selectedVariant, setSelectedVariant] = useState(block.variant || '');
  const blockDef = BLOCK_DEFINITIONS.find((def) => def.type === block.type);

  if (!blockDef) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Edit {blockDef.name} Block
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Choose Variant</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blockDef.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                  selectedVariant === variant.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }`}
              >
                {/* Preview */}
                <div className="mb-3">
                  <VariantPreview
                    blockType={block.type}
                    variant={variant.id}
                    className={selectedVariant === variant.id ? 'border-blue-500' : 'border-gray-600'}
                  />
                </div>
                
                {/* Variant Info */}
                <div className="text-white font-medium mb-1">{variant.name}</div>
                <div className="text-gray-400 text-sm">{variant.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedVariant)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Variant
          </button>
        </div>
      </div>
    </div>
  );
}