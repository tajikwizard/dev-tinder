import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  useEffect(() => {
    const fetchProfile = async () => {
      if (feed) return;
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addFeed(res.data));
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError('Unauthorized. Please login first.');
        } else {
          setError('Failed to fetch profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg w-96 p-6">
        <div className="flex flex-col items-center">
          <img
            src={
              feed.photoUrl ||
              'https://avatars.githubusercontent.com/u/67753244?v=4'
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-bold">
            {feed.firstName} {feed.lastName}
          </h2>
          <p className="text-gray-500">{feed.email}</p>
          <p className="mt-2 text-gray-700">{feed.desc}</p>
          <p className="mt-2 text-gray-500">Age: {feed.age}</p>

          {feed.skills && feed.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {feed.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2 my-5">
          <button className="btn btn-primary">Interested</button>
          <button className="btn btn-secondary">Ignore</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
