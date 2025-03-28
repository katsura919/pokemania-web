"use client";
import { useState, useEffect } from "react";
import BattleForm from "@/components/battle/battle-form";
import { Icons } from "@/components/icons";

// Add this to prevent prerendering
export const dynamic = 'force-dynamic';

export default function BattlePage() {
  const [battleResult, setBattleResult] = useState<{
    winner_id: number | null;
    winner_name: string | null;
  }>({ winner_id: null, winner_name: null });

  // State for client-side mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-900">
      {/* Conditional rendering of browser-dependent elements */}
      {isClient && (
        <>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </>
      )}

      {/* Rest of your component remains the same */}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header with Animation */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icons.sword className="h-8 w-8 text-red-500 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-600">
              Pokémon Battle Arena
            </h1>
            <Icons.shield className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict the outcome of epic Pokémon battles! Select two Pokémon and see who would win based on their stats.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Battle Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="p-1 bg-gradient-to-r from-red-500 to-blue-600"></div>
              <div className="p-6 sm:p-8">

                <BattleForm setBattleData={setBattleResult} />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-full">
              <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Icons.trophy className="h-6 w-6" />
                  Battle Results
                </h2>
                
                {battleResult.winner_name ? (
                  <div className="animate-in fade-in">
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-amber-200">
                      <div className="flex justify-center mb-4">
                        <Icons.trophy className="h-12 w-12 text-yellow-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Champion!
                      </h3>
                      <p className="text-xl font-medium capitalize text-gray-700 mb-1">
                        {battleResult.winner_name}
                      </p>
                      

                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icons.swords className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">
                      No battle results yet
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Select Pokémon and battle to see results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>
      
    </div>
    </div>
  );
}