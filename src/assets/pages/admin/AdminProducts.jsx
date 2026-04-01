import { useState,useEffect,useCallback, useRef } from "react";
import { useForm,useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Modal } from "bootstrap";
import axios from "axios";
import ImagesArrayInput from "../../comps/ImagesArrayInput";
import InputImage from "../../comps/InputImage";
import InputRadio from "../../comps/InputRadio";
import InputTextarea from "../../comps/InputTextarea";
import InputSelect from "../../comps/InputSelect";
import InputText from "../../comps/InputText";
import { pushMsg } from "../../slices/messageSlice";
import MessageToast from "../../comps/MessageToast";


function AdminProduct({ data,openModal }) {
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
                            <td>{product.price}</td>
                            <td>
                                {product.is_enabled ? 
                                  <span className="badge text-bg-success">是</span>  : 
                                  <span className="badge text-bg-danger">否</span>
                                 }
                            </td>
                            <td>
                                <button 
                                    type="button" 
                                    className="btn btn-primary me-2"
                                    onClick={() => openModal('edit', product)}
                                >
                                    編輯
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={() => openModal('del', product)}
                                >刪除</button>
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
        register,
        handleSubmit,
        formState:{errors,isSubmitting},
        reset,
        getValues,
        control,
        watch,
     } = useForm({
            mode: 'onTouched',
            defaultValues:{category:'',is_enabled: 0,imageUrl: '',imagesUrl: [''],}
        })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "imagesUrl" // 對應資料結構中的陣列名稱
    });
    const dispatch = useDispatch();
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;

    const [product , setProduct] = useState([]);

    const getProduct = useCallback(
        async()=>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/admin/products/all`)
                
                const rawData = res.data.products;
                const data = Array.isArray(rawData)? 
                rawData : 
                (rawData ? Object.values(rawData) : [])
                setProduct(data);
            } catch (error) {
                
            }
        },[apiUrl, apiSub, apiPath]
    );
    
    useEffect(()=>{
        getProduct();
    },[getProduct])

    //-- modal
    const modalTarget = useRef(null);
    const modalControl = useRef(null);
    const [ modalMode, setModalMode ] = useState('add');//'add' or 'edit' or 'del'
    const [ tempProduct,setTempProduct ] = useState(null);
    // 處理 ModalHeader 文字，避免純文字節點衝突
    const getModalTitle = () => {
        if (modalMode === 'edit') return "編輯商品資訊";
        if (modalMode === 'add') return "新增商品資訊";
        if (modalMode === 'del') return "是否刪除此商品？";
        return "";
    };
    //---- modal控制
    const openModal = (mode, product) => {
        setModalMode(mode);
        setTempProduct(product);

        if (mode === 'edit' || mode === 'del') {
            const productReset = {
                ...product,
                is_enabled: String(product.is_enabled),
                // 確保 imagesUrl 存在，否則 useFieldArray 可能報錯
                imagesUrl: product.imagesUrl || [] 
            };
            reset(productReset);
        } else {
            reset({
                title: '',
                category: '',
                unit: '',
                origin_price: 0,
                price: 0,
                is_enabled: '1',
                description: '',
                content: '',
                imageUrl: '',
                imagesUrl: ['', '', '', '', '']
            });
        }
        modalControl.current.show();
    };
    const closeModal = () => {
        if (modalControl.current) {
            modalControl.current.hide();
        }
    }   ;

    // ... onSubmit, handleDel, getProduct 省略

    
    //---- modal初始化
    useEffect(() => {
        if (modalTarget.current) {
            modalControl.current = new Modal(modalTarget.current);

            // 定義 hidden 事件處理函式
            const handleHidden = () => {
                reset({
                    title: '',
                    category: '',
                    unit: '',
                    origin_price: 0,
                    price: 0,
                    is_enabled: '1',
                    description: '',
                    content: '',
                    imageUrl: '',
                    imagesUrl: []
                });
                setTempProduct(null);
            };

            // 監聽 Modal 完全隱藏後的動作
            const modalEl = modalTarget.current;
            modalEl.addEventListener('hidden.bs.modal', handleHidden);

            return () => {
                // 清除監聽器與實例，防止記憶體洩漏與重複觸發
                modalEl.removeEventListener('hidden.bs.modal', handleHidden);
                if (modalControl.current) {
                    modalControl.current.dispose();
                }
            };
        }
    }, [reset]); // 這裡監聽 reset 是為了確保 handleHidden 內抓到正確的 reset 函式

    //-- POST / PUT
    const onSubmit = async (data) => {
        //整理資料：去掉id、is_enabled轉number
        const { id, ...rest } = data;
        const postData = {
            ...rest,
            is_enabled: Number(data.is_enabled)
        };

        //動態屬性存取
        const isEdit= modalMode === 'edit';
        const apiPost = `${apiUrl}${apiSub}${apiPath}/admin/product`;
        const apiPut = `${apiUrl}${apiSub}${apiPath}/admin/product/${id}`;
        
        const method = isEdit? 'put' : 'post';
        const url = isEdit ? apiPut : apiPost
        try {
            const res = await axios[method]( url, { data: postData } );
            if(res.data.success){
                getProduct();
                closeModal();
                dispatch(pushMsg({
                    type: 'success',
                    title: isEdit ? '編輯成功' : '新增成功',
                    text: `商品「${postData.title}」已${isEdit ? '更新' : '建立'}`
                }));
            }
            
        } catch (error) {
            dispatch(pushMsg({
                type: 'danger',
                title: isEdit ? '更新失敗' : '新增失敗',
                text: error.response?.data?.message || '伺服器錯誤'
            }))
        }
    };
    // DELETE
    const handleDel = async() =>{
        try {
            const res= await axios.delete(`${apiUrl}${apiSub}${apiPath}/admin/product/${tempProduct.id}`)

            if (res.data.success) {
                getProduct();
                closeModal();
                dispatch(pushMsg({
                    type: 'success',
                    title: '刪除成功',
                    text : `商品已刪除` 
                }))
            }

        } catch (error) {
           
            dispatch(pushMsg({
                type: 'danger',
                title: '刪除失敗',
                text: error.response?.data?.message || '伺服器錯誤'
            }))
        }
    }

    return <>
        <h1>商品資訊</h1>

        <AdminProduct data={product} openModal={openModal} />
        <button type="button"
        className="btn btn-info text-light"
        onClick={() => openModal('add')}>
            新增商品
        </button>

        <hr />

        <div ref={modalTarget} className="modal" tabIndex='-1' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{getModalTitle()}</h5>
                    </div>
                    <div className="modal-body">
                        {
                            modalMode === 'del' ? (
                                <div key="del-content">
                                    <p>
                                        商品名稱：{watch('title')}
                                        <br />
                                        商品編號：{tempProduct?.id}
                                    </p>
                                </div>
                            ) : (
                                <form key="edit-content" onSubmit={handleSubmit(onSubmit)}
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
                                        <option value="組">組</option>
                                        <option value="件">件</option>
                                        <option value="袋">袋</option>
                                        </InputSelect>
                                        <InputRadio 
                                            id="is_enabled"
                                            labelText="是否上架"
                                            register={register}
                                            errors={errors}
                                            watch={watch}
                                            rule={{ 
                                                required: '請選擇是否上架',
                                                valueAsNumber:true
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
                                        fields={fields}
                                        append={append}
                                        remove={remove}
                                    />
                                </form>
                            )

                        }
                    </div>
                    <div className="modal-footer">
                        {
                            modalMode === 'del' ? ( 
                                <button type="button"
                                    className="btn btn-danger"
                                    onClick={handleDel}>
                                        確認刪除
                                </button>
                            ) : (
                                <button type="button"
                                    className="btn btn-outline-info"
                                    onClick={handleSubmit(onSubmit)}>
                                        確認送出
                                </button>
                            )
                        }
                        <button type="button"
                            className="btn btn-outline-danger"
                            onClick={closeModal}
                            >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

