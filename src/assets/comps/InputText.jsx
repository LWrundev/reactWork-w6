
export default function InputText({ id,type,labelText,holder,register,errors,rule }) {
    return <>
        <div className="form-floating">
            <input type={type} id={id}
                placeholder={holder}
                className={`form-control ${errors[id] ? 'is-invalid':''}`}
                {...register(id,rule)} />
            <label htmlFor={id} className="form-label">{labelText}</label>
            { errors[id] && <span className="invalid-feedback">{errors[id].message}</span>  }
        </div>
    </>
}