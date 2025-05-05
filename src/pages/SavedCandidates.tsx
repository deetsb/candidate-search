import * as React from 'react';
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';
import { IoRemoveCircle } from 'react-icons/io5';


const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState<'name' | 'location'>('name');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]') as Candidate[];
    setSavedCandidates(saved);
  }, []);

  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  const filteredCandidates = savedCandidates.filter(candidate =>
    (((candidate.name || candidate.login) || '').toLowerCase()).includes(filter.toLowerCase())
  );

  const sortedCandidates = filteredCandidates.sort((a, b) => {
    if (sortOption === 'name') {
      const nameA = (a.name || a.login) || '';
      const nameB = (b.name || b.login) || '';
      return nameA.localeCompare(nameB);
    } else {
      const locationA = a.location || '';
      const locationB = b.location || '';
      return locationA.localeCompare(locationB);
    }
  });

  return (
    <div className="saved-candidates-container">
      <h1>Potential Candidates</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter candidates by name"
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select
          value={sortOption}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value as 'name' | 'location')}>
          <option value="name">Sort by Name</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>
      {sortedCandidates.length > 0 ? (
        <table className="saved-candidates-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.map(candidate => (
              <tr key={candidate.id}>
                <td>
                  <img
                  className="candidate-avatar-table"
                  src={candidate.avatar_url}
                  alt={candidate.login}
                  />
                </td>
                <td>{candidate.name ? `${candidate.name} (${candidate.login})` : candidate.login}</td>
                <td>{candidate.location || 'N/A'}</td>
                <td>{candidate.email || 'N/A'}</td>
                <td>{candidate.company || 'N/A'}</td>
                <td>{candidate.bio || 'N/A'}</td>
                <td>
                  <IoRemoveCircle
                    className={styles.removeButton}
                    onClick={() => removeCandidate(candidate.id || 0)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No saved candidates found.</p>
      )}
    </div>
  );
};

export default SavedCandidates;
