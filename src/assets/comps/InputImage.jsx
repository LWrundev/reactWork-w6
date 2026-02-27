
export default function InputImage({ id, labelText, register,rule, errors, watch }) {
    // 使用 watch 即時監聽該欄位的數值，達成預覽效果
    const imageUrl = watch(id);

    return (
        <div className=" row">
            <div className="col-4">
                <div className="form-floating mb-2">
                    <input
                        type="text"
                        id={id}
                        className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
                        placeholder="請輸入圖片網址"
                        {...register(id,rule)}
                    />
                    <label htmlFor={id}>{labelText}</label>
                </div>
            </div>
            <div className="col-8">
                {/* 預覽圖區域 */}
                {imageUrl && (
                    <div className="mt-2">
                        <img 
                            src={imageUrl} 
                            alt="預覽圖" 
                            className="img-fluid rounded border" 
                            style={{ maxHeight: '200px', objectFit: 'cover' }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}