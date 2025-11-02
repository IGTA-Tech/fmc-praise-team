'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';

export function AddWeekForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    date: '',
    rehearsal_date: '',
    attire: '',
    worship_leader: '',
    songs: [{ title: '', youtube_url: '', lead_singer: '', type: 'Opening', notes: '' }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const addSong = () => {
    setFormData({
      ...formData,
      songs: [...formData.songs, { title: '', youtube_url: '', lead_singer: '', type: 'Other', notes: '' }]
    });
  };

  const removeSong = (index: number) => {
    const newSongs = formData.songs.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, songs: newSongs });
  };

  const updateSong = (index: number, field: string, value: string) => {
    const newSongs = [...formData.songs];
    newSongs[index] = { ...newSongs[index], [field]: value };
    setFormData({ ...formData, songs: newSongs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Week created successfully!');
        router.push('/admin/dashboard');
      } else {
        alert('Failed to create week');
      }
    } catch (error) {
      alert('Error creating week');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center mb-8 gap-4">
        <div className={`px-4 py-2 rounded-full ${step === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          1. Week Info
        </div>
        <div className={`px-4 py-2 rounded-full ${step === 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          2. Songs
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">Week Information</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Service Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rehearsal Date</label>
            <input
              type="date"
              value={formData.rehearsal_date}
              onChange={(e) => setFormData({ ...formData, rehearsal_date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attire</label>
            <select
              value={formData.attire}
              onChange={(e) => setFormData({ ...formData, attire: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select attire...</option>
              <option>All white</option>
              <option>All black</option>
              <option>Red, black, white</option>
              <option>Purple and gold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Worship Leader</label>
            <select
              value={formData.worship_leader}
              onChange={(e) => setFormData({ ...formData, worship_leader: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select leader...</option>
              <option>Adeline</option>
              <option>Pastor Jones</option>
              <option>Chris</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            Next: Add Songs <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add Songs</h2>
            <button
              type="button"
              onClick={addSong}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Song
            </button>
          </div>

          {formData.songs.map((song: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow border-2">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Song {index + 1}</h3>
                {formData.songs.length > 1 && (
                  <button type="button" onClick={() => removeSong(index)} className="text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">YouTube URL *</label>
                  <input
                    type="url"
                    value={song.youtube_url}
                    onChange={(e) => updateSong(index, 'youtube_url', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={song.title}
                    onChange={(e) => updateSong(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Lead Singer *</label>
                    <select
                      value={song.lead_singer}
                      onChange={(e) => updateSong(index, 'lead_singer', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select...</option>
                      <option>Adeline</option>
                      <option>Clarissa</option>
                      <option>Chris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <select
                      value={song.type}
                      onChange={(e) => updateSong(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option>Opening</option>
                      <option>Offering</option>
                      <option>Sermonic</option>
                      <option>Communion</option>
                      <option>Closing</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    value={song.notes}
                    onChange={(e) => updateSong(index, 'notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 border rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : <><Save className="w-5 h-5" /> Create Week</>}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
