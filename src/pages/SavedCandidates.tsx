import * as React from 'react';
import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';
import { IoRemoveCircle } from 'react-icons/io5';


const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]') as Candidate[];
    setSavedCandidates(saved);
  }, []);

  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };


  return (
    <div className="saved-candidates-container">
      <h1>Potential Candidates</h1>

      {savedCandidates.length > 0 ? (
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
            {savedCandidates.map(candidate => (
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
