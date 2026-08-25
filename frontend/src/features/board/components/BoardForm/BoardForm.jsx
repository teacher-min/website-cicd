import styles from "./BoardForm.module.css";

/**
 * 게시글 폼 컴포넌트 (등록/수정 공통)
 */
const BoardForm = ({ formData, isEdit, isSubmitting, onChange, onSubmit, onCancel }) => {
  return (
    <div className={styles.boardFormContainer}>
      <form onSubmit={onSubmit} className={styles.form}>
        {/* 제목 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            제목 <span className={styles.required}>*</span>
          </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={onChange}
            placeholder="제목을 입력하세요"
            disabled={isSubmitting}
            className={styles.input}
          />
        </div>

        {/* 내용 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            내용 <span className={styles.required}>*</span>
          </label>
          <textarea 
            id="content" 
            name="content" 
            value={formData.content} 
            onChange={onChange} 
            placeholder="내용을 입력하세요"
            rows={15} 
            disabled={isSubmitting}
            className={styles.textarea}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`${styles.submitButton} ${isEdit ? styles.edit : styles.create}`}
          >
            {isSubmitting ? "처리 중..." : isEdit ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;