import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:3000/profile/view', {
          withCredentials: true,
        });
        setProfile(res.data.data); // API returns { message, data }
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
              profile.photoUrl ||
              'https://avatars.githubusercontent.com/u/67753244?v=4'
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
          <h2 className="text-xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-500">{profile.email}</p>
          <p className="mt-2 text-gray-700">{profile.desc}</p>
          <p className="mt-2 text-gray-500">Age: {profile.age}</p>

          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {profile.skills.map((skill, index) => (
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
      </div>
    </div>
  );
}

export default Profile;
