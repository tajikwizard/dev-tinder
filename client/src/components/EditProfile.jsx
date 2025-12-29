import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    desc: '',
    skills: [],
    photoUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle text/number/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle skills input (comma-separated)
  const handleSkillsChange = (e) => {
    setProfile({
      ...profile,
      skills: e.target.value.split(',').map((s) => s.trim()),
    });
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.patch(
        'http://localhost:3000/profile/edit',
        profile,
        { withCredentials: true },
      );
      setProfile(res.data.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg w-96 p-6 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>

        {success && <p className="text-green-500 text-center">{success}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Static Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={profile.photoUrl || 'https://i.pravatar.cc/150'}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2"
          />
        </div>

        {/* Form Fields */}
        <input
          type="text"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          name="age"
          value={profile.age}
          onChange={handleChange}
          placeholder="Age"
          className="border px-3 py-2 rounded-md"
        />
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <textarea
          name="desc"
          value={profile.desc}
          onChange={handleChange}
          placeholder="Description"
          className="border px-3 py-2 rounded-md"
        />
        <input
          type="text"
          name="skills"
          value={profile.skills.join(', ')}
          onChange={handleSkillsChange}
          placeholder="Skills (comma separated)"
          className="border px-3 py-2 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
