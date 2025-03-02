import { useState } from "react";
import httpService from "../../services/HttpService";
import ApiConfig from "../../constants/ApiConfig.constants";
import styles from "./ChallengeModal.module.css";

interface ShareData {
  shareUrl: string;
  imageUrl: string;
}

export const ChallengeModal = ({ onClose, score }: { onClose: () => void, score: number }) => {
  const [username, setUsername] = useState("");
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Check username availability
      await httpService.post(ApiConfig.endpoints.register, { username, score });
      // Generate challenge link
      const { data } = await httpService.post(ApiConfig.endpoints.generate, { username });
      setShareData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Username already taken. Please try another.");
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    if (shareData) {
      const message = `Can you beat my Globetrotter score? 🌍 ${shareData.shareUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {!shareData ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>Challenge Friends</h2>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trimStart())}
                className={styles.input}
                disabled={loading}
                required
              />
              {error && <p className={styles.error}>{error}</p>}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={!username || loading}
                className={`${styles.button} ${styles.primary}`}
              >
                {loading ? "Creating Challenge..." : "Create Challenge"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${styles.button} ${styles.secondary}`}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.shareContent}>
            <div className={styles.preview}>
              <img
                src={shareData.imageUrl}
                alt="Challenge preview"
                className={styles.previewImage}
              />
              <p className={styles.shareText}>
                Share this link to challenge friends:
                <br />
                <a
                  href={shareData.shareUrl}
                  className={styles.shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shareData.shareUrl}
                </a>

              </p>
            </div>

            <div className={styles.shareButtons}>
              <button
                onClick={shareToWhatsApp}
                className={`${styles.button} ${styles.whatsapp}`}
              >
                Share via WhatsApp
              </button>
              <button
                onClick={onClose}
                className={`${styles.button} ${styles.secondary}`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
