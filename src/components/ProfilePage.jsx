import React from 'react'

const ProfilePage = () => {
  return (
    <div>
       <div className="whatsapp-profile-popup">
         <button className="back-btn" onClick={onBack}><FaArrowLeft size={24}/></button>
              <div className="sidebar">
                <ul>
                  <li className="active">Overview</li>
                  <li>Media</li>
                  <li>Files</li>
                  <li>Links</li>
                  <li>Events</li>
                  <li>Encryption</li>
                </ul>
              </div>

              <div className="profile-content">
                <button className="close-btn" onClick={close}>
                  &times;
                </button>

                <div className="profile-header">
                  <FaUserCircle size={100} className="profile-avatar" />
                  <FiEdit className="edit-icon" />
                  <h2>{user.name.toUpperCase()}</h2>
                  <span className="nickname">~{user.username}</span>
                </div>

                <div className="profile-details">
                  <p>
                    <strong>About</strong>
                  </p>
                  <p className="light">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe, qui tenetur totam iusto, corporis, eum voluptas eius quasi id a adipisci? Praesentium est suscipit, saepe rerum architecto obcaecati distinctio atque.</p>

                  <p>
                    <strong>Phone number</strong>
                  </p>
                  <p>{user.phone|| 123456789}</p>

                  <p>
                    <strong>Disappearing messages</strong>
                  </p>
                  <p>Off</p>

                  <p>
                    <strong>Advanced chat privacy</strong>
                  </p>
                  <p className="light">
                    This setting can only be updated on your phone.
                  </p>
                </div>
              </div>
            </div>
    </div>
  )
}

export default ProfilePage
