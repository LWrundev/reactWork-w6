import { useState,useEffect,useCallback } from "react";
import { useForm,useFieldArray } from "react-hook-form";
import axios from "axios";
import { data } from "react-router-dom";
import ImagesArrayInput from "../../comps/ImagesArrayInput";
import InputImage from "../../comps/InputImage";
import InputRadio from "../../comps/InputRadio";
import InputTextarea from "../../comps/InputTextarea";
import InputSelect from "../../comps/InputSelect";

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

