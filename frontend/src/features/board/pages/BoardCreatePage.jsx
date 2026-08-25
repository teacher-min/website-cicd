import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardAPI";
import BoardForm from "../components/BoardForm/BoardForm";
import styles from "./BoardCreatePage.module.css";

/**
 * 게시글 등록 페이지
 */
const BoardCreatePage = () => {
  const navigate = useNavigate();

  // 상태 데이터
  const [ formData, setFormData ] = useState({
    title: "",
    content: "",
  });
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  /**
   * 입력값 변경 핸들러
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return ({
        ...prev,
        [name]: value,
      })
    })
  }

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !formData.title.trim() ) {
      alert("제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const responseData = await createBoard(formData);
      alert(responseData.message || "게시글이 등록되었습니다.");
      navigate("/boards");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        navigate("/boards");
      }
    } else {
      navigate("/boards");
    }
  }

  return (
    <div className={styles.boardCreatePage}>
      <div className={styles.container}>
        <h2 className={styles.title}>게시글 등록</h2>
        
        <BoardForm 
          formData={formData}
          isEdit={false}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default BoardCreatePage;