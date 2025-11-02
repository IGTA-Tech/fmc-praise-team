'use client';

import { AddWeekForm } from '@/components/admin';
import { ArrowLeft, Music2 } from 'lucide-react';
import Link from 'next/link';

export default function AddSongsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <Music2 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Add New Week</h1>
                <p className="text-purple-100 text-sm">Schedule songs for worship service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AddWeekForm />
      </div>
    </div>
  );
}
