
export default function ImagesArrayInput({ control, register, watch, errors, rule }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "imagesUrl"
    });

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <label className="form-label fw-bold mb-3">副圖設定 (最多 5 張)</label>
                
                {fields.map((field, index) => {
                    const watchUrl = watch(`imagesUrl.${index}`);
                    const error = errors?.imagesUrl?.[index];

                    return (
                        <div key={field.id} className="row align-items-center mb-3 pb-3 border-bottom">
                            {/* 左側：輸入網址與移除按鈕 (佔 8 格) */}
                            <div className="col-md-8">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${error ? 'is-invalid' : ''}`}
                                        placeholder={`副圖網址 ${index + 1}`}
                                        {...register(`imagesUrl.${index}`, rule)}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger" 
                                        onClick={() => remove(index)}
                                    >
                                        移除
                                    </button>
                                </div>
                                {/* 錯誤訊息顯示空間 */}
                                {error && (
                                    <div className="invalid-feedback d-block">
                                        {error.message}
                                    </div>
                                )}
                            </div>

                            {/* 右側：預覽圖 (佔 4 格) */}
                            <div className="col-md-4 text-center">
                                {watchUrl ? (
                                    <img 
                                        src={watchUrl} 
                                        alt="副圖預覽" 
                                        className="img-thumbnail" 
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                        onError={(e) => { e.target.style.opacity = '0.3'; }}
                                    />
                                ) : (
                                    <div className="text-muted small border rounded d-flex align-items-center justify-content-center" 
                                         style={{ height: '80px', borderStyle: 'dashed' }}>
                                        無圖片
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 新增按鈕 */}
                {fields.length < 5 && (
                    <div className="mt-2">
                        <button 
                            type="button" 
                            className="btn btn-outline-primary w-100"
                            onClick={() => append("")}
                        >
                            <i className="bi bi-plus-lg me-1"></i> 新增副圖
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}