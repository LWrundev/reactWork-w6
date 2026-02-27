import { useState,useEffect,useCallback } from "react";
import { useForm,useFieldArray } from "react-hook-form";
import axios from "axios";
import { data } from "react-router-dom";

function AdminProduct({ data,openEditModal }) {
    return <>
        <table className="table table-striped align-middle">
            <thead>
                <tr>
                <th scope="col">類別</th>
                <th scope="col">名稱</th>
                <th scope="col">原價</th>
                <th scope="col">折扣價</th>
                <th scope="col">是否上架</th>
                <th scope="col">編輯商品</th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.map((product)=>{return (
                        <tr key={product.id}>
                            <td>{product.category}</td>
                            <td>{product.title}</td>
                            <td>{product.origin_price}</td>
                            <td>
                                {product.is_enabled ? 
                                  <span className="badge text-bg-success">是</span>  : 
                                  <span className="badge text-bg-danger">否</span>
                                 }
                            </td>
                            <td>{product.price}</td>
                            <td>
                                <button 
                                    type="button" 
                                    className="btn btn-primary me-2"
                                    onClick={() => openEditModal(product)}
                                >
                                    編輯
                                </button>
                                <button type="button" className="btn btn-danger">刪除</button>
                            </td>
                        </tr>
                    )})
                }
            </tbody>
        </table>
    </>
}

export default function Admin() {
    const { 
        register,handleSubmit,formState:{errors,isSubmitting},reset,getValues,control ,watch
     } = useForm({mode: 'onTouched',
        defaultValues:{category:'',is_enabled: 0,imageUrl: '',imagesUrl: [''],}
     })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "imagesUrl" // 對應資料結構中的陣列名稱
    });
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;

    const [product , setProduct] = useState([]);
    const [modalMode, setModalMode] = useState('add'); // 'add' 或 'edit'
    const [tempProductId, setTempProductId] = useState(null);
    const openEditModal = (product) => {
        setModalMode('edit');
        setTempProductId(product.id);
        reset({
            ...product,
            // 關鍵：若後端沒回傳副圖，給予空字串陣列以維持輸入框存在
            imagesUrl: product.imagesUrl && product.imagesUrl.length > 0 
                ? product.imagesUrl 
                : ['']
        });
        window.scrollTo({ top: document.querySelector('form').offsetTop - 20, behavior: 'smooth' });
    };
    
    const getProduct = useCallback(
        async()=>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/admin/products/all`)
                
                const rawData = res.data.products;
                const data = Array.isArray(rawData)? 
                rawData : 
                (rawData ? Object.values(rawData) : [])
                setProduct(data);

                console.log(data);
            } catch (error) {
                
            }
        },[apiUrl, apiSub, apiPath]
    );
    
    useEffect(()=>{
        getProduct();
    },[getProduct])

    const onSubmit = async (formData) => {
        try {
            const payload = { data: formData };
            let res;

            if (modalMode === 'add') {
                // 新增商品
                res = await axios.post(`${apiUrl}${apiSub}${apiPath}/admin/product`, payload);
            } else {
                // 編輯商品
                res = await axios.put(`${apiUrl}${apiSub}${apiPath}/admin/product/${tempProductId}`, payload);
            }

            if (res.data.success) {
                alert(res.data.message);
                getProduct(); // 重新取得列表
                reset({ // 清空表單
                    category:'', is_enabled: 0, imageUrl: '', imagesUrl: [''] 
                });
                setModalMode('add'); // 回到新增模式
            }
        } catch (error) {
            alert(error.response?.data?.message || '操作失敗');
        }
    };
    return <>
        <h1>商品資訊</h1>

        <AdminProduct data={product} openEditModal={openEditModal} />
        <hr />
        <form action="" onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column gap-3">
            <InputText 
                id={'title'}
                type={'text'}
                labelText={'商品名稱'}
                holder={'請填寫~請填寫 2~20 字元'}
                register={register}
                errors={errors}
                rule={{
                    required:{ value:true , message: '必填' },
                    maxLength:{ value:20 , message: '名稱最多20字元' },
                    minLength:{ value:2 , message: '名稱最小需2字元' }
                }}
                 />
            <div className="d-flex gap-3">
                <InputText 
                    id={'origin_price'}
                    type={'number'}
                    labelText={'商品原價'}
                    holder={'請填寫商品原價'}
                    register={register}
                    errors={errors}
                    rule={{
                        required:{ value:true , message: '必填' },
                        max:{ value:99999 , message: '價格超過上限' },
                        min:{ value:0 , message: '價格至少需 1 元」' },
                        valueAsNumber: true
                    }}
                        />
                <InputText 
                    id={'price'}
                    type={'number'}
                    labelText={'商品折扣價'}
                    holder={'請填寫商品折扣價'}
                    register={register}
                    errors={errors}
                    rule={{
                        required:{ value:true , message: '必填' },
                        max:{ value:99999 , message: '價格超過上限' },
                        min:{ value:0 , message: '價格不得小於0' },
                        valueAsNumber: true,
                        validate: (value)=>{
                            const originPrice = getValues('origin_price');
                            return value <= originPrice ?true : '折扣價不可高於原價';
                        }
                    }}
                        />
            </div>
            <div className="d-flex gap-3">
                <InputSelect
                    id="category"
                    labelText="商品分類"
                    register={register}
                    errors={errors}
                    rule={{ required: '請選擇分類' }}
                >
                <option value="用品配件">用品配件</option>
                <option value="休閒玩具">休閒玩具</option>
                <option value="美味零食">美味零食</option>
                </InputSelect>
                <InputSelect
                    id="unit"
                    labelText="販售單位"
                    register={register}
                    errors={errors}
                    rule={{ required: '請選擇販售單位' }}
                >
                <option value="用品配件">組</option>
                <option value="休閒玩具">件</option>
                <option value="美味零食">袋</option>
                </InputSelect>
                <InputRadio 
                    id="is_enabled"
                    labelText="是否上架"
                    register={register}
                    errors={errors}
                    rule={{ 
                        required: '請選擇是否上架',
                        valueAsNumber: true // ✅ 關鍵：將 "0"/"1" 字串轉回數字 0/1
                    }}
                />
            </div>
            <InputTextarea 
                id="description"
                labelText="商品描述"
                holder="請填寫商品描述，10~100字元"
                register={register}
                errors={errors}
                rule={{
                    required: '必填',
                    maxLength: { value: 100, message: '描述最多100字元' },
                    minLength: { value: 10, message: '描述最小需10字元' }
                }}
            />
            <InputTextarea 
                id={'content'}
                labelText={'商品規格'}
                holder={'請填寫商品規格，10~250字元'}
                register={register}
                errors={errors}
                rule={{
                    required: '必填',
                    maxLength: { value: 250, message: '描述最多250字元' },
                    minLength: { value: 10, message: '描述最小需10字元' }
                }}
            />
            <InputImage 
                id="imageUrl"
                labelText="商品主圖網址"
                register={register}
                errors={errors}
                watch={watch}
                rule={{
                    required: '圖片網址為必填',
                    pattern: {
                        value: /^https?:\/\/.+/,
                        message: '請輸入有效的 HTTP/HTTPS 網址'
                    }
                }}
            />
           <ImagesArrayInput 
                control={control} 
                register={register} 
                watch={watch} 
                errors={errors}
                rule={{
                    required: '圖片網址為必填',
                    pattern: {
                        value: /^https?:\/\/.+/,
                        message: '請輸入有效的 HTTP/HTTPS 網址'
                    }
                }}
            />
            <div className="d-flex justify-content-end gap-2 mt-4">
                {/* 取消按鈕通常用於關閉 Modal */}
                <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => { /* 這裡寫關閉 Modal 的邏輯 */ }}
                >
                    取消
                </button>
                
                {/* 送出按鈕 */}
                <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                    disabled={isSubmitting} // 防止重複提交
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            處理中...
                        </>
                    ) : (
                        modalMode === 'add' ? '確認新增' : '儲存編輯'
                    )}
                </button>
            </div>
        </form>
    </>
}

function InputText({ id,type,labelText,holder,register,errors,rule }) {
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

function InputSelect({ id,labelText,register,errors,rule,children }) {
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
function InputTextarea({ id, labelText, holder, register, errors, rule }) {
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

function InputRadio({ id, labelText, register, errors, rule }) {
    const error = errors[id];

    return (
        <div className="">
            <label className="form-label d-block">{labelText}</label>
            
            {/* 選項：是 (1) */}
            <div className="form-check form-check-inline">
                <input
                    className={`form-check-input ${error ? 'is-invalid' : ''}`}
                    type="radio"
                    value="1" // HTML 預設是字串
                    id={`${id}True`}
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

function InputImage({ id, labelText, register,rule, errors, watch }) {
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
function ImagesArrayInput({ control, register, watch, errors, rule }) {
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