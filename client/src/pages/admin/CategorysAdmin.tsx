import { Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { ToggleSwitch } from "flowbite-react";
import { toast } from "react-toastify";
import instance from "../../instance/instance";
import { CategorysContext } from "../../context/CategoryContext";
import slugify from "react-slugify";
import { useForm } from "react-hook-form";
import { ICategory } from "../../interfaces/ICategory";
import { zodResolver } from "@hookform/resolvers/zod";
import CategorySchemaValid from "../../schemaValid/CategorySchemaValid";
import swal from "sweetalert";


const CategorysAdmin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState(true);
  const { categorys, dispatch } = useContext(CategorysContext);
  const [slugCategory, setSlugCategory] = useState<string>("");
  const [AddOrUpdate, setAddOrUpdate] = useState<string>("ADD");
  const [idCategory,setIdCategory]=useState<string>("");
  //list data categorys
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("categorys");
        dispatch({
          type: "LIST",
          payload: data.data,
        });
      } catch (error) {
        toast.error(`Lỗi ${error.response.data.message}`);
      }
    })();
  }, []);

  // update status category
  const handleUpdateStatus = async (id: string, statusCategory: boolean) => {
    try {
      const { data } = await instance.patch(`categorys/${id}`, {
        status: statusCategory,
      });
      dispatch({
        type: "UPDATE",
        payload: data.data,
      });
      if (data.data.status) {
        toast.success("Public");
      } else {
        toast.warning("Private");
      }
    } catch (error) {
      toast.error(`Lỗi ${error.response.data.message}`);
    }
  };

  // add category
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ICategory>({
    resolver: zodResolver(CategorySchemaValid),
  });
// add or update
  const onSubmit = async (dataForm: ICategory) => {
    switch (AddOrUpdate) {
      case "ADD":
        try {
          const { data } = await instance.post(`categorys`, {
            name: dataForm.name,
            slug: slugify(slugCategory),
            status,
          });
          setOpenModal(false);
          toast.success("Thêm danh mục thành công !");
          dispatch({
            type: "ADD",
            payload: data.data,
          });
        } catch (error) {
          toast.error(`Lỗi ${error.response.data.message}`);
        }
        break;
      case "UPDATE":
        try {
          const { data } = await instance.put(`categorys/${idCategory}`, {
            name: dataForm.name,
            slug: slugify(slugCategory),
            status,
          });
          setOpenModal(false);
          setAddOrUpdate("ADD")
          toast.success("Sửa danh mục thành công !");
          dispatch({
            type: "UPDATE",
            payload: data.data,
          });
        } catch (error) {
          toast.error(`Lỗi ${error.response.data.message}`);
        }
        break;

      default:
        break;
    }
  };
  // fill data in form Category and do update
  const fillDataCategory = async (id: string) => {
    try {
      const { data } = await instance.get(`categorys/${id}`);
      const { _id, name,slug, status } = data.data;
      reset({ name});
      setIdCategory(_id)
      setSlugCategory(slug)
      setStatus(status)
      setAddOrUpdate("UPDATE")
    } catch (error) {
      console.log(error);
    }
  };
  // remove Category
  const handleRemove = async (id: string) => {
    try {
      await instance.delete(`categorys/${id}`);
      dispatch({
        type: "DELETE",
        payload: id,
      });
    } catch (error) {
      toast.error(`Lỗi ${error.response.data.message}`);
    }
  };
// reset data 
  useEffect(() => {
    (() => {
      reset({
        name: "",
      });
      setAddOrUpdate("ADD")
      setSlugCategory("")

    })();
  }, [openModal === false]);

  return (
    <div className="categorys-admin">
      <button
        onClick={() => setOpenModal(true)}
        className="flex items-center py-2 px-4 bg-primary text-util rounded-md hover:bg-util hover:text-primary hover:outline hover:outline-primary transition-all"
      >
        Thêm danh mục{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={"md"}
      >
        <Modal.Header>
          {AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} danh mục
        </Modal.Header>
        <Modal.Body>
          <div className="px-3 pb-2 ">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3 w-full">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name-category"
                    className="font-medium text-sm"
                  >
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    className="block border border-[#d9d9d9] rounded-md w-full h-10 text-sm"
                    placeholder="Tên danh mục: "
                    {...register("name", {
                      onChange(event) {
                        setSlugCategory(event.target.value);
                      },
                    })}
                  />
                  <span className="text-sm text-red-400">
                    {errors.name?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="slug-category"
                    className="font-medium text-sm"
                  >
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="Slug:"
                    className="block border border-[#d9d9d9] text-sm rounded-md bg-gray-100 h-10 hover:cursor-not-allowed w-full"
                    disabled
                    {...register("slug")}
                    value={slugify(slugCategory)}
                  />
                </div>
                <div>
                  <ToggleSwitch
                    label="Trạng thái"
                    checked={status}
                    {...register("status")}
                    onChange={setStatus}
                    className="my-8"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center py-2 px-4 bg-primary text-util rounded-md hover:bg-util hover:text-primary hover:outline hover:outline-primary transition-all "
              >
                {AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} danh mục
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <table className="table w-full mt-5 *:border">
        <thead className="h-14 bg-primary text-white">
          <tr className="*:border">
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Slug</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categorys &&
            categorys.map((category, index) => {
              return (
                <tr className="*:border text-center h-12" key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <ToggleSwitch
                      checked={category.status}
                      onChange={() => {
                        setStatus(!category.status);
                        handleUpdateStatus(category._id!, !category.status);
                      }}
                      className="mx-auto"
                    />
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                          swal({
                            title: "Bạn có muốn xóa danh mục này ?",
                            text: "Sau khi xóa sẽ không thể không phục !",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleRemove(category._id!);
                              swal("Xóa Danh mục thành công !", {
                                icon: "success",
                              });
                            }
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="red"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                          setOpenModal(true);
                          setAddOrUpdate("UPDATE");
                          fillDataCategory(category._id!);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="#1B95F2"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default CategorysAdmin;
