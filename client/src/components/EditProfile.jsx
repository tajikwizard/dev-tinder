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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:3000/profile/view', {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // replace with your preset

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, // replace with your cloud name
        formData,
      );

      setProfile({ ...profile, photoUrl: res.data.secure_url });
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

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
      setSuccess('Profile updated successfully!');
      setProfile(res.data.data);
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

        {/* Profile Image Preview */}
        <div className="flex flex-col items-center">
          <img
            src={profile.photoUrl || 'https://i.pravatar.cc/150'}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

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
          onChange={(e) =>
            setProfile({
              ...profile,
              skills: e.target.value.split(',').map((s) => s.trim()),
            })
          }
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
