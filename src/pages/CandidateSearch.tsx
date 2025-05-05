import React from 'react';
import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await searchGithub();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      if (candidates.length === 0) { return; }
      
        try {
          const candidate = await searchGithubUser(candidates[currentIndex].login);
          setCurrentCandidate(candidate);
        } catch (error) {
          console.error('Error fetching candidate details:', error);
        }
    
    };

    fetchCandidateDetails();
  }, [candidates, currentIndex]);

  const handleNextCandidate = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % candidates.length);
  };
  const handleAccept = () => {
    if (currentCandidate) {
      const saved = JSON.parse(localStorage.getItem('savedCandidates') || '[]') as Candidate[];
      saved.push(currentCandidate);
      localStorage.setItem('savedCandidates', JSON.stringify(saved));
    }
    handleNextCandidate();
  }
  return (
    <div className="candidate-search-container">
      <h1>CandidateSearch</h1>
      {currentCandidate ? (
        <div className="candidate-card">
          <img className="candidate-avatar" src={currentCandidate.avatar_url} alt={currentCandidate.login} />
          <h2>{currentCandidate.name ? `${currentCandidate.name} (${currentCandidate.login})`
            : currentCandidate.login}
          </h2>
          <p><strong>Location:</strong> {currentCandidate.location || 'N/A'}</p>
          <p><strong>Email:</strong> {currentCandidate.email || 'N/A'}</p>
          <p><strong>Company:</strong> {currentCandidate.company || 'N/A'}</p>
          <p><strong>Bio:</strong> {currentCandidate.bio || 'N/A'}</p>
          <div className="button-group">
            <button className="reject-button" onClick={handleNextCandidate}>-</button>
            <button className="accept-button" onClick={handleAccept}>+</button>
          </div>
        </div>
      ) : (
        <p>No more candidates are available.</p>
      )}
    </div>
  );
};

export default CandidateSearch;
