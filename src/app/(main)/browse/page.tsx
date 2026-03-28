import QuestCardGallery, { Quest } from '@/components/cards/QuestCardGallery';

export default function BrowsePage() {
  const sampleQuests: Quest[] = [
    {
      id: '1',
      title: 'Pick up a prescription',
      description: 'Need someone to pick up a small bag of asthma medication from Boots on Commercial Road and drop it off near the university.',
      distance: '0.8 mi',
      time: '2 hrs ago',
      reward: '50 pts',
    },
    {
      id: '2',
      title: 'Help moving a heavy box',
      description: 'I have a medium sized box with books that needs to go to the second floor. Will take 5 minutes max!',
      distance: '1.2 mi',
      time: '5 hrs ago',
      reward: '100 pts',
    },
    {
      id: '3',
      title: 'Walk my Golden Retriever',
      description: 'Sprained my ankle and Charlie needs his evening walk around Victoria Park. He is very friendly.',
      distance: '2.5 mi',
      time: '1 day ago',
      reward: '150 pts',
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start p-4 h-full relative overflow-hidden">
      <div className="w-full max-w-sm mb-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Discover</h2>
        <p className="text-[#34D1BF] font-medium text-sm mt-1">Acts of kindness near you</p>
      </div>
      
      <div className="flex-1 w-full max-w-sm flex flex-col justify-center items-center mt-4">
        <QuestCardGallery initialQuests={sampleQuests} />
      </div>

    </div>
  );
}
