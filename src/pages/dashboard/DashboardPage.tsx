import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api/client';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch statistics for admin users
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
    enabled: user?.isAdmin,
  });

  const { data: childUsersData } = useQuery({
    queryKey: ['child-users'],
    queryFn: () => api.get('/child-users'),
    enabled: user?.isAdmin,
  });

  // Single call to get all exercises (they're already grouped by type)
  const { data: exercisesData } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => api.get('/exercises'),
    enabled: user?.isAdmin,
  });

  // Calculate totals
  const totalUsers = Array.isArray(usersData?.data) ? usersData.data.length : 0;
  const totalChildUsers = Array.isArray(childUsersData?.data) ? childUsersData.data.length : 0;
  
  // Extract exercises from the new API structure
  const exercisesResponse = exercisesData?.data as { exercises?: { 
    letter?: unknown[], 
    animal?: unknown[], 
    number?: unknown[], 
    color?: unknown[] 
  }} | undefined;
  
  const letterExercises = exercisesResponse?.exercises?.letter || [];
  const animalExercises = exercisesResponse?.exercises?.animal || [];
  const numberExercises = exercisesResponse?.exercises?.number || [];
  const colorExercises = exercisesResponse?.exercises?.color || [];
  
  const totalExercises = 
    (Array.isArray(letterExercises) ? letterExercises.length : 0) +
    (Array.isArray(animalExercises) ? animalExercises.length : 0) +
    (Array.isArray(numberExercises) ? numberExercises.length : 0) +
    (Array.isArray(colorExercises) ? colorExercises.length : 0);

  // Exercise distribution data for pie chart
  const exerciseDistribution = [
    {
      name: 'Letter Exercises',
      value: Array.isArray(letterExercises) ? letterExercises.length : 0,
      color: '#475569' // Slate 600
    },
    {
      name: 'Animal Exercises',
      value: Array.isArray(animalExercises) ? animalExercises.length : 0,
      color: '#0F766E' // Teal 700
    },
    {
      name: 'Number Exercises',
      value: Array.isArray(numberExercises) ? numberExercises.length : 0,
      color: '#1D4ED8' // Blue 700
    },
    {
      name: 'Color Exercises',
      value: Array.isArray(colorExercises) ? colorExercises.length : 0,
      color: '#7C3AED' // Violet 600
    }
  ].filter(item => item.value > 0);

  // Age distribution data for children
  const childrenAgeDistribution = React.useMemo(() => {
    if (!Array.isArray(childUsersData?.data)) return [];
    
    const ageGroups = {
      '0-3 years': 0,
      '4-6 years': 0,
      '7-9 years': 0,
      '10+ years': 0
    };

    childUsersData.data.forEach((child: { birthdate?: string | Date }) => {
      if (child.birthdate) {
        const birthDate = new Date(child.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust for month/day difference
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age <= 3) ageGroups['0-3 years']++;
        else if (age <= 6) ageGroups['4-6 years']++;
        else if (age <= 9) ageGroups['7-9 years']++;
        else ageGroups['10+ years']++;
      }
    });

    return [
      { name: '0-3 years', value: ageGroups['0-3 years'], color: '#334155' }, // Slate 700
      { name: '4-6 years', value: ageGroups['4-6 years'], color: '#0369A1' }, // Sky 700
      { name: '7-9 years', value: ageGroups['7-9 years'], color: '#059669' }, // Emerald 600
      { name: '10+ years', value: ageGroups['10+ years'], color: '#9333EA' } // Purple 600
    ].filter(item => item.value > 0);
  }, [childUsersData]);

  const entityCards = [
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      path: '/entities/users',
      icon: '👥',
      adminOnly: true
    },
    {
      title: 'Child Users',
      description: 'Manage child user profiles',
      path: '/entities/child-users',
      icon: '👶',
      adminOnly: false
    },
    {
      title: 'Letter Exercises',
      description: 'Manage letter learning exercises',
      path: '/entities/letter-exercises',
      icon: '🔤',
      adminOnly: false
    },
    {
      title: 'Animal Exercises',
      description: 'Manage animal learning exercises',
      path: '/entities/animal-exercises',
      icon: '🐾',
      adminOnly: false
    },
    {
      title: 'Number Exercises',
      description: 'Manage number learning exercises',
      path: '/entities/number-exercises',
      icon: '🔢',
      adminOnly: false
    },
    {
      title: 'Color Exercises',
      description: 'Manage color learning exercises',
      path: '/entities/color-exercises',
      icon: '🎨',
      adminOnly: false
    }
  ];

  const visibleCards = entityCards.filter(card => 
    !card.adminOnly || (card.adminOnly && user?.isAdmin)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lexo Back Office Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName || user?.email}! Manage your Lexo platform entities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCards.map((card) => (
          <Link 
            key={card.path} 
            to={card.path}
            className="block transition-transform hover:scale-105"
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{card.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                  {card.adminOnly && (
                    <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Admin Only
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {user?.isAdmin && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Statistics
          </h2>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-teal-700">{totalChildUsers}</div>
              <div className="text-sm text-gray-600">Child Users</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{totalExercises}</div>
              <div className="text-sm text-gray-600">Total Exercises</div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise Distribution Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Distribution</h3>
              {exerciseDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={exerciseDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {exerciseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No exercise data available
                </div>
              )}
            </Card>

            {/* Children Age Distribution Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Children Age Distribution</h3>
              {childrenAgeDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={childrenAgeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {childrenAgeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No child user data available
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
