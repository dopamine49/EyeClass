import React from 'react';

function ReviewReel({ reels }) {
  return (
    <section className="reel-wrap">
      <div className="section-heading">
        <h2>Review kiểu TikTok</h2>
        <p>Khách hàng thật, feedback thật, lên hình thật đẹp.</p>
      </div>
      <div className="reel-grid">
        {reels.map((item) => (
          <article className="reel-card" key={item.id}>
            <header>
              <img src={item.avatar} alt={item.name} loading="lazy" />
              <div>
                <strong>{item.name}</strong>
                <small>{item.handle}</small>
              </div>
            </header>
            <p>{item.content}</p>
            <footer>
              <span>Video review</span>
              <span>{item.likes} likes</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewReel;
