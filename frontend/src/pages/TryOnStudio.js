import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { useCatalogData } from '../hooks/useCatalogData';

function TryOnStudio() {
  const { id } = useParams();
  const { products, loading } = useCatalogData();
  const product = useMemo(() => products.find((item) => String(item.id) === String(id)), [products, id]);

  const [selectedModel, setSelectedModel] = useState('Model A');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  if (loading) {
    return <AppShell><p className="feedback-text">Đang khởi động virtual try-on...</p></AppShell>;
  }

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const onUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadedPhoto(URL.createObjectURL(file));
  };

  return (
    <AppShell>
      <section className="tryon-layout">
        <div className="camera-frame">
          {uploadedPhoto ? <img src={uploadedPhoto} alt="uploaded face" className="uploaded-face" /> : null}
          <div className="face-detection-box">Face tracking area</div>
          <div className="glasses-overlay">{product.name}</div>
          <p className="camera-note">Camera preview simulation</p>
        </div>

        <aside className="tryon-panel">
          <h1>Virtual Try-On</h1>
          <p>Chọn model để preview và thử nhanh trên camera.</p>

          <div className="tryon-models">
            {['Model A', 'Model B', 'Model C'].map((model) => (
              <button
                key={model}
                type="button"
                className={`btn btn-lite ${selectedModel === model ? 'active' : ''}`}
                onClick={() => setSelectedModel(model)}
              >
                {model}
              </button>
            ))}
          </div>

          <label className="upload-field">
            Upload ảnh khuôn mặt
            <input type="file" accept="image/*" onChange={onUpload} />
          </label>

          <div className="tryon-actions">
            <Link className="btn btn-primary" to={`/products/${product.id}`}>Về chi tiết sản phẩm</Link>
            <Link className="btn btn-ghost" to="/shop">Thử mẫu khác</Link>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

export default TryOnStudio;
