import Image from 'next/image';

export default function Follows() {
  const isFollowing = true;
  const followers = [
    { id: 1, name: 'Amanda Wang'},
    { id: 2, name: 'Naman Modani'},
    { id: 3, name: 'Ethan Dao'},
    { id: 4, name: 'Venkat Bollapragada'},
    { id: 5, name: 'Marianne Gutierrez'},
    { id: 6, name: 'Min Gao'},
    { id: 7, name: 'Zitong Zhou'},
    { id: 8, name: 'Honghua Zhang'},
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold ml-24 mb-4 self-start">
        {isFollowing ? 'Following' : 'Followers'}
      </h1>
      <div className="w-full max-w-6xl p-4 rounded-lg shadow-md flex flex-wrap gap-4 justify-start">
        {followers.map((follower) => (
          <div key={follower.id} className="flex flex-col items-center space-y-2 p-3 rounded-lg min-w-[18%]">
            <div className="w-36 aspect-square rounded-full bg-profile-lavender flex items-center justify-center overflow-hidden">
              <Image 
                src="/default-profile-pic.svg" 
                alt={follower.name} 
                width={80} 
                height={80} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">{follower.name}</p>
              <p className="text-gray-500 text-xs">Profile</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
