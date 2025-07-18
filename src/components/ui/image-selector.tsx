import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Input } from './input';

interface ImageOption {
  url: string;
  name: string;
  category: string;
}

type ImageCategory = 'letters' | 'animals' | 'numbers' | 'hand_numbers' | 'fruits' | 'avatars' | 'badges' | 'exercises' | 'short_words' | 'general';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  category?: ImageCategory;
  placeholder?: string;
  label?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCAzNUM0Ni42ODYzIDM1IDQ0IDM3LjY4NjMgNDQgNDFDNDQgNDQuMzEzNyA0Ni42ODYzIDQ3IDUwIDQ3QzUzLjMxMzcgNDcgNTYgNDQuMzEzNyA1NiA0MUM1NiAzNy42ODYzIDUzLjMxMzcgMzUgNTAgMzVaIiBmaWxsPSIjOTQ5Nzk5Ii8+CjxwYXRoIGQ9Ik0zMCA2NUw3MCA2NUw2MCA1NUw1MCA2MEw0MCA1MEwzMCA2NVoiIGZpbGw9IiM5NDk3OTkiLz4KPHRleHQgeD0iNTAiIHk9IjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjU3Mzg2IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';

// Predefined image options based on the API structure
const getImageOptions = (category: string): ImageOption[] => {
  const baseOptions: Record<string, ImageOption[]> = {
    letters: [
      // Letters are lowercase in the actual structure
      ...Array.from({ length: 26 }, (_, i) => {
        const letter = String.fromCharCode(97 + i); // a-z (lowercase)
        return {
          url: `${API_BASE_URL}/public/letters/${letter}.png`,
          name: `Letter ${letter.toUpperCase()}`,
          category: 'letters'
        };
      })
    ],
    animals: [
      // Only the animals that actually exist in the API
      'cat', 'dog', 'elephant', 'fish', 'fox', 'frog', 'horse', 'lion', 
      'monkey', 'octopus', 'panda', 'pig', 'snake', 'turtle'
    ].map(animal => ({
      url: `${API_BASE_URL}/public/animals/${animal}.png`,
      name: animal.charAt(0).toUpperCase() + animal.slice(1),
      category: 'animals'
    })),
    numbers: [
      // Numbers 0-9 (actual range)
      ...Array.from({ length: 10 }, (_, i) => ({
        url: `${API_BASE_URL}/public/numbers/${i}.png`,
        name: `Number ${i}`,
        category: 'numbers'
      }))
    ],
    hand_numbers: [
      // Hand numbers 0-10 (actual range)
      ...Array.from({ length: 11 }, (_, i) => ({
        url: `${API_BASE_URL}/public/hand_numbers/hand_${i}.png`,
        name: `Hand ${i}`,
        category: 'hand_numbers'
      }))
    ],
    fruits: [
      // Only the fruits that actually exist in the API
      'apple_green', 'banana_yellow', 'grape_black', 'grape_purple', 
      'kiwi_brown', 'orange_orange', 'peach_pink', 'pineapple_yellow', 'raspberry_red'
    ].map(fruit => {
      const [fruitName, color] = fruit.split('_');
      return {
        url: `${API_BASE_URL}/public/fruits/${fruit}.png`,
        name: `${fruitName.charAt(0).toUpperCase() + fruitName.slice(1)} (${color})`,
        category: 'fruits'
      };
    }),
    avatars: [
      'pumpkin', 'reader'
    ].map(avatar => ({
      url: `${API_BASE_URL}/public/avatars/${avatar}.png`,
      name: avatar.charAt(0).toUpperCase() + avatar.slice(1),
      category: 'avatars'
    })),
    badges: [
      ...Array.from({ length: 10 }, (_, i) => ({
        url: `${API_BASE_URL}/public/badges/badge_${i + 1}.png`,
        name: `Badge ${i + 1}`,
        category: 'badges'
      })),
      {
        url: `${API_BASE_URL}/public/badges/badge_lock.png`,
        name: 'Badge Lock',
        category: 'badges'
      }
    ],
    exercises: [
      'animals_1', 'colors_1', 'flags', 'numbers_1', 'questioning',
      'reading_1', 'reading_2', 'reading_3', 'reading_4', 'reading_5', 'writing_1'
    ].map(exercise => ({
      url: `${API_BASE_URL}/public/exercises/${exercise}.png`,
      name: exercise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: 'exercises'
    })),
    short_words: [
      'bus', 'cat', 'dad', 'dog', 'fan', 'hot', 'mom', 'pen', 'sun', 'wet'
    ].map(word => ({
      url: `${API_BASE_URL}/public/short_words/${word}.png`,
      name: word.charAt(0).toUpperCase() + word.slice(1),
      category: 'short_words'
    })),
    general: [
      { url: 'https://example.com/thumbnail.png', name: 'Example Thumbnail', category: 'general' },
      { url: 'https://example.com/image.jpg', name: 'Example Image', category: 'general' }
    ]
  };

  return baseOptions[category] || baseOptions.general;
};

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  category = 'letters',
  placeholder = 'Select an image',
  label = 'Image'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageOptions, setImageOptions] = useState<ImageOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    setImageOptions(getImageOptions(selectedCategory));
  }, [selectedCategory]);

  const filteredImages = imageOptions.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl);
    setIsModalOpen(false);
  };

  const categories: Array<{ key: ImageCategory; label: string }> = [
    { key: 'letters', label: 'Letters' },
    { key: 'animals', label: 'Animals' },
    { key: 'numbers', label: 'Numbers' },
    { key: 'hand_numbers', label: 'Hand Numbers' },
    { key: 'fruits', label: 'Fruits' },
    { key: 'avatars', label: 'Avatars' },
    { key: 'badges', label: 'Badges' },
    { key: 'exercises', label: 'Exercise Thumbnails' },
    { key: 'short_words', label: 'Short Words' }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      
      {/* Current Image Preview */}
      <div className="flex items-center space-x-4">
        {value && (
          <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={value}
              alt="Selected"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mb-2"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Browse Images
          </Button>
        </div>
      </div>

      {/* Image Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[85vh] w-full overflow-hidden shadow-xl border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Image</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 max-h-20 overflow-y-auto">
                {categories.map(cat => (
                  <Button
                    key={cat.key}
                    type="button"
                    variant={selectedCategory === cat.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.key)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* Search */}
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Image Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredImages.map((image, index) => (
                  <Card
                    key={index}
                    className="p-2 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-2">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <p className="text-xs text-center text-gray-600 truncate">
                      {image.name}
                    </p>
                  </Card>
                ))}
              </div>
              
              {filteredImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No images found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
