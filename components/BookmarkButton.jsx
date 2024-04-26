"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaBookmark, FaLeaf } from "react-icons/fa";
import { toast } from "react-toastify";

const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkBookmarkStatus = async () => {
      try {
        const res = await fetch("/api/bookmarks/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property.data._id,
          }),
        });

        if (res.status === 200) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.log("fetch bookmarks error ", error);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [property.data._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You need to sign in to bookmark a property.");
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property.data._id,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success(data.message);
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.log("fetch bookmarks error ", error);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }
  return isBookmarked ? (
    <button
      onClick={handleClick}
      className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
      <FaBookmark className='fas fa-bookmark mr-2' />
      Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className='bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
      <FaBookmark className='fas fa-bookmark mr-2' />
      Bookmark Property
    </button>
  );
};

export default BookmarkButton;
