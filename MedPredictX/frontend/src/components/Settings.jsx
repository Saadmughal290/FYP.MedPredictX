import { useState, useEffect } from "react";
import Layout from "./common/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  User,
  Bell,
  Lock,
  Mail,
  Calendar,
  Shield
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    specialization: '',
    license_number: '',
    // Health fields
    height: '',
    weight: '',
    age: '',
    gender: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.profile?.phone_number || '',
        specialization: user.profile?.specialization || '',
        license_number: user.profile?.license_number || '',
        height: user.profile?.height || '',
        weight: user.profile?.weight || '',
        age: user.profile?.age || '',
        gender: user.profile?.gender || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');

      console.log('Sending profile data:', profileData);

      // Update profile via API
      const response = await axios.put('http://localhost:8000/api/profile/', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Profile updated successfully:', response.data);
      toast.success("Profile updated successfully! Refreshing...");

      // Reload page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error details:', error.response?.data);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // TODO: Connect to backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password changed successfully!");
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const isDoctorRole = user?.profile?.role === 'DOCTOR';

  return (
    <Layout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Settings
          </h1>
          <p style={{ fontSize: '1rem', color: '#6B7280' }}>
            Manage your account preferences and security settings
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', maxWidth: '900px' }}>
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#D1ECF1',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Account Information</CardTitle>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Update your personal details
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={profileData.phone_number}
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 000-0000"
                    className="border-gray-300"
                  />
                </div>

                {/* Patient Health Fields */}
                {!isDoctorRole && (
                  <>
                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                        📊 Health Information
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            value={profileData.height}
                            onChange={handleProfileChange}
                            placeholder="170"
                            step="0.01"
                            className="border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            value={profileData.weight}
                            onChange={handleProfileChange}
                            placeholder="70"
                            step="0.01"
                            className="border-gray-300"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            value={profileData.age}
                            onChange={handleProfileChange}
                            placeholder="25"
                            className="border-gray-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #D1D5DB',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              backgroundColor: 'white'
                            }}
                          >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {isDoctorRole && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleProfileChange}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        name="license_number"
                        value={profileData.license_number}
                        onChange={handleProfileChange}
                        className="border-gray-300"
                        disabled
                      />
                      <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        Contact admin to update license number
                      </p>
                    </div>
                  </>
                )}


                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9CA3AF' : '#17A2B8',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#148A9C';
                    }}
                    onMouseOut={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#17A2B8';
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Security</CardTitle>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Manage your password and security settings
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="old_password">Current Password</Label>
                  <Input
                    id="old_password"
                    name="old_password"
                    type="password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="border-gray-300"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Choose how you want to be notified
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive updates via email', state: emailNotifications, setState: setEmailNotifications, icon: Mail },
                  { label: 'Appointment Reminders', desc: 'Get reminded about upcoming appointments', state: appointmentReminders, setState: setAppointmentReminders, icon: Calendar }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>{item.label}</div>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => item.setState(!item.state)}
                        style={{
                          position: 'relative',
                          width: '48px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: item.state ? '#3B82F6' : '#D1D5DB',
                          transition: 'background-color 0.2s',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <motion.div
                          animate={{ x: item.state ? 24 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: '2px',
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleSaveNotifications}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
