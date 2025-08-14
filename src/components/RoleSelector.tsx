import React, { useState } from 'react';
import { Briefcase, Code, Users, ChevronDown } from 'lucide-react';
import { Role } from '../types/resume';
import { getRolesByCategory } from '../data/roles';

interface RoleSelectorProps {
  selectedRole: Role | null;
  onRoleSelect: (role: Role) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  const [activeCategory, setActiveCategory] = useState<'IT' | 'Non-IT' | 'All'>('All');
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { id: 'All', label: 'All Roles', icon: <Briefcase size={20} />, color: 'bg-gray-500' },
    { id: 'IT', label: 'IT Roles', icon: <Code size={20} />, color: 'bg-blue-500' },
    { id: 'Non-IT', label: 'Non-IT Roles', icon: <Users size={20} />, color: 'bg-green-500' }
  ] as const;

  const filteredRoles = getRolesByCategory(activeCategory);

  const handleRoleSelect = (role: Role) => {
    onRoleSelect(role);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Select Your Target Role</h2>
          <p className="text-blue-100">Choose the role you're applying for to get tailored resume analysis</p>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-200
                ${activeCategory === category.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              <div className={`p-1 rounded ${category.color} text-white`}>
                {category.icon}
              </div>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Selected Role Display */}
        {selectedRole ? (
          <div className="p-6 bg-green-50 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${selectedRole.category === 'IT' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                  {selectedRole.category === 'IT' ? <Code size={20} /> : <Users size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedRole.title}</h3>
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Change Role</span>
                <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Briefcase size={32} className="mx-auto mb-2 text-gray-400" />
            <p>Select a role to get started with tailored analysis</p>
          </div>
        )}

        {/* Role List */}
        {(isOpen || !selectedRole) && (
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {filteredRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-blue-50"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${role.category === 'IT' ? 'bg-blue-500' : 'bg-green-500'} text-white flex-shrink-0`}>
                      {role.category === 'IT' ? <Code size={20} /> : <Users size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{role.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          role.category === 'IT' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {role.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.keySkills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {skill}
                          </span>
                        ))}
                        {role.keySkills.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                            +{role.keySkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};