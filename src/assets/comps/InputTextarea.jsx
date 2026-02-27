
export default function InputTextarea({ id, labelText, holder, register, errors, rule }) {
    const error = errors[id];

    return (
        <div className="form-floating ">
            <textarea
                id={id}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder={holder}
                style={{ height: '120px' }} // 設定預設高度
                {...register(id, rule)}
            />
            <label htmlFor={id}>{labelText}</label>
            
            {error && (
                <div className="invalid-feedback">
                    {error.message}
                </div>
            )}
        </div>
    );
}