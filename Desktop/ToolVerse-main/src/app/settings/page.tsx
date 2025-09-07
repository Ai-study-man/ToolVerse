"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { User, Shield, Bell, Settings, Edit, Save, X, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  location: string;
  website: string;
}

interface UserStats {
  toolsAdded: number;
  reviewsWritten: number;
  rating: number;
  joinDate: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    location: '',
    website: ''
  });
  const [userStats, setUserStats] = useState<UserStats>({
    toolsAdded: 0,
    reviewsWritten: 0,
    rating: 0,
    joinDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(userProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    newToolAlerts: true,
    reviewResponses: true
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    defaultView: 'grid'
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
        setEditForm(profileData);
      } else {
        // Set default profile data if API fails
        const defaultProfile = {
          name: 'John Doe',
          email: 'user@example.com',
          phone: '+1 (555) 123-4567',
          bio: 'AI tools enthusiast',
          avatar: '',
          location: 'San Francisco, CA',
          website: 'https://example.com'
        };
        setUserProfile(defaultProfile);
        setEditForm(defaultProfile);
      }

      // Fetch user stats
      const statsResponse = await fetch('/api/user/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats({
          toolsAdded: statsData.toolsAdded || 0,
          reviewsWritten: statsData.reviewsWritten || 0,
          rating: statsData.rating || 0,
          joinDate: statsData.joinDate || new Date().getFullYear().toString()
        });
      } else {
        // Set default stats if API fails
        setUserStats({
          toolsAdded: 12,
          reviewsWritten: 8,
          rating: 4.5,
          joinDate: '2024'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set default data on error
      const defaultProfile = {
        name: 'John Doe',
        email: 'user@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'AI tools enthusiast',
        avatar: '',
        location: 'San Francisco, CA',
        website: 'https://example.com'
      };
      setUserProfile(defaultProfile);
      setEditForm(defaultProfile);
      
      setUserStats({
        toolsAdded: 12,
        reviewsWritten: 8,
        rating: 4.5,
        joinDate: '2024'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setUserProfile(editForm);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm(userProfile);
                          }}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.name || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.email || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.phone || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.location || 'Not set'}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.website}
                          onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.website || 'Not set'}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.bio || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{userStats.toolsAdded}</p>
                        <p className="text-sm text-gray-600">Tools Added</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{userStats.reviewsWritten}</p>
                        <p className="text-sm text-gray-600">Reviews Written</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{userStats.rating ? userStats.rating.toFixed(1) : '0.0'}</p>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{userStats.joinDate || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Member Since</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Security</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                      <p className="text-gray-600 mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Login Sessions</h4>
                      <p className="text-gray-600 mb-4">
                        Manage your active login sessions across different devices.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Revoke All Sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h4>
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-600">
                                {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                                {key === 'pushNotifications' && 'Receive push notifications on your device'}
                                {key === 'marketingEmails' && 'Receive promotional emails and newsletters'}
                                {key === 'weeklyDigest' && 'Weekly summary of platform activity'}
                                {key === 'newToolAlerts' && 'Notifications when new tools are added'}
                                {key === 'reviewResponses' && 'Notifications when someone responds to your reviews'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleNotificationChange(key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={preferences.theme}
                            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            value={preferences.timezone}
                            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Asia/Shanghai">China Standard Time</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select
                            value={preferences.dateFormat}
                            onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default View
                          </label>
                          <select
                            value={preferences.defaultView}
                            onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="grid">Grid View</option>
                            <option value="list">List View</option>
                            <option value="card">Card View</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h4>
                      <p className="text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
