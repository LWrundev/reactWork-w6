
export default function InputSelect({ id,labelText,register,errors,rule,children }) {
    return (
        <div className="form-floating">
            <select id={id}
            defaultValue="" 
            className={`form-select ${errors[id] ?'is-invalid':''}`}
            {...register(id,rule)}>
                <option value="" disabled>請選擇{labelText}</option>
                {children}
            </select>
            <label htmlFor={id}>{labelText}</label>
            {errors[id] && (
                    <span className="invalid-feedback">
                        {errors[id].message}
                    </span>
                )}
        </div>

    )
}