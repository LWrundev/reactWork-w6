
export default function InputRadio({ id, labelText, register, errors, rule,watch }) {
    const error = errors[id];
    const currentValue = watch(id);
    return (
        <div>
            <label className="form-label d-block">{labelText}</label>
            {/* 選項：是 (1) */}
            <div className="form-check form-check-inline">
                <input
                    className={`form-check-input ${error ? 'is-invalid' : ''}`}
                    type="radio"
                    value="1" // HTML 預設是字串
                    id={`${id}True`}
                    checked={currentValue == "1"}
                    {...register(id, rule)}
                />
                <label className="form-check-label" htmlFor={`${id}True`}>是</label>
            </div>

            {/* 選項：否 (0) */}
            <div className="form-check form-check-inline">
                <input
                    className={`form-check-input ${error ? 'is-invalid' : ''}`}
                    type="radio"
                    value="0"
                    id={`${id}False`}
                    checked={currentValue == "0"}
                    {...register(id, rule)}
                />
                <label className="form-check-label" htmlFor={`${id}False`}>否</label>
            </div>

            {/* 錯誤訊息 */}
            {error && (
                <div className="invalid-feedback d-block">
                    {error.message}
                </div>
            )}
        </div>
    );
}