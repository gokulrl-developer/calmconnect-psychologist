import React, { useState } from 'react';
import { Save, Camera, Mail, Phone, MapPin, User } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useTheme } from '../contexts/ThemeContext';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Smith',
    email: 'dr.smith@calmconnect.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Experienced clinical psychologist specializing in anxiety, depression, and trauma therapy. Committed to providing compassionate care and evidence-based treatments.',
    specialization: 'Clinical Psychology',
    qualifications: 'PhD in Clinical Psychology, Licensed Clinical Psychologist',
    experience: '8 years',
    languages: 'English, Spanish',
    licenseNumber: 'LP-NY-12345',
    hourlyRate: '2500'
  });
  const { isDarkMode } = useTheme();

  const handleSave = () => {
    // Handle saving profile data
    setIsEditing(false);
    // In a real app, this would make an API call
    console.log('Profile data saved:', profileData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle image upload
      console.log('Image uploaded:', file);
      // In a real app, this would upload to a server
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Profile
        </h1>
        <Button
          variant={isEditing ? "primary" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "pulse-glow" : ""}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            'Edit Profile'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gray-800 dark:bg-gray-600 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {profileData.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {profileData.specialization}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {profileData.email}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {profileData.phone}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {profileData.location}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Professional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specialization
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.specialization}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Languages
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.languages}
                  onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.languages}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                License Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.licenseNumber}
                  onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                />
              ) : (
                <p className="text-gray-800 dark:text-white">{profileData.licenseNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hourly Rate (₹)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg border 
                    ${isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                  `}
                  placeholder="Enter hourly rate"
                />
              ) : (
                <p className="text-gray-800 dark:text-white">₹{profileData.hourlyRate}/hour</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qualifications
            </label>
            {isEditing ? (
              <textarea
                value={profileData.qualifications}
                onChange={(e) => setProfileData({ ...profileData, qualifications: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border resize-none h-20
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
              />
            ) : (
              <p className="text-gray-800 dark:text-white">{profileData.qualifications}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border resize-none h-32
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600 text-white' 
                    : 'bg-white/50 border-gray-300 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent
                `}
              />
            ) : (
              <p className="text-gray-800 dark:text-white">{profileData.bio}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;