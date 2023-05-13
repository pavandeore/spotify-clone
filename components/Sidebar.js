import { playListIdState } from "@/atoms/playListAtom";
import useSpotify from "@/hooks/useSpotify";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Sidebar = () => {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playLists, setPlayLists] = useState([]);
  const [playListId, setPlayListID] = useRecoilState(playListIdState);

  console.log(playLists)
  console.log(playListId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlayLists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-500 p-5 text-xs border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen lg:text-sm sm:max-w-[12rem] lg:max-w-[16rem] hidden md:inline-flex">
      <div className="space-y-4">
        {/* <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 hover:text-white"
        >
          <HomeIcon className="h-5 w-5" />
          <p>Logout</p>
        </button> */}
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlist */}
        {playLists.map((playList) => (
          <p
            key={playList.id}
            onClick={() => setPlayListID(playList.id)}
            className="cursor-pointer hover:text-white"
          >
            {playList.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
