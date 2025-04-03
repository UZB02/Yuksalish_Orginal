<template>
  <div class="relative overflow-x-auto shadow-md rounded">
    <table class="min-w-[1400px] text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-2 py-3">Haridor</th>
          <th scope="col" class="px-2 w-40 py-3">Tell</th>
          <th scope="col" class="px-2 w-28 py-3">Sotildi KG</th>
          <th scope="col" class="px-2 w-32 py-3 ">1 kg uchun</th> <th scope="col" class="px-2 w-40 py-3">Asl narxi 1 kg</th>
          <th scope="col" class="px-2 min-w-52 py-3">Tushkan summa</th>
          <th scope="col" class="px-2 min-w-52 py-3">Sof foyda</th>
          <th scope="col" class="px-2 w-40 py-3">Sotilgan vaqti</th>
          <th scope="col" class="px-2 py-3">O'chirish</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, itemKey) in productHistory?.history" :key="itemKey" class="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
          <th scope="row" class="px-2 py-4 font-medium text-gray-900 dark:text-white w-56 overflow-hidden whitespace-nowrap text-ellipsis">{{ item?.name }}</th>
          <td class="px-2 py-4">{{ item?.phone }}</td>
          <td class="px-2 py-4">{{ item?.size }} kg</td>
          <td class="px-2 py-4">{{ formatCurrency(item?.sellingPrice) }}</td>
          <td class="px-2 py-4">{{ formatCurrency(item?.originalPrice) }}</td>
          <td class="px-2 py-4">{{ formatCurrency(item?.totalAmount) }}</td>
          <td class="px-2 py-4">{{ formatCurrency(item?.profit) }}</td>
          <td class="px-2 py-4">{{ formatDateTime(item?.createdAt) }}</td>
          <td class="px-2 py-4 flex justify-center gap-2">
            <button @click="deleteProductHistory(item?._id)"><i class="pi pi-trash text-red-500"></i></button>
            <button @click="viewDescription(item)"><i class="pi pi-eye"></i></button>
          </td>
        </tr>
        <tr v-if="!productHistory?.history?.length">
          <td colspan="9" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Sotilgan ma'lumotlar yo'q</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Paginator -->
  <Paginator :rows="limit" :totalRecords="totalItems" :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPageChange" />

  <!-- Modal View -->
  <div v-if="viewVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg w-96">
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="text-lg font-semibold">{{ viewProduct?.name }}</h3>
        <button @click="viewVisible = false">✖</button>
      </div>
      <p class="mt-4">{{ viewProduct?.description || "Tafsilotlar mavjud emas!" }}</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import formatCurrency from "../../utils/PriceFormatter";
import formatDateTime from "../../utils/DateTimeFormatter";
// import Swal from "sweetalert2";

const id = useRoute().params.id;
const productHistory = ref(null);
const page = ref(1);
const limit = ref(5);
const totalItems = ref(0);
const viewVisible = ref(false);
const viewProduct = ref(null);

const getProductHistory = async () => {
  try {
    const response = await axios.get(`/api/product-history/${id}?page=${page.value}&limit=${limit.value}`);
    productHistory.value = response.data;
    totalItems.value = response.data.total;
  } catch (error) {
    console.error(error);
  }
};

const deleteProductHistory = async (itemId) => {
  try {
    await axios.delete(`/api/product-history/delete/${itemId}`);
    Swal.fire({ position: "top-center", icon: "success", title: "Ma'lumot o'chirildi", showConfirmButton: false, timer: 1500 });
    getProductHistory();
  } catch (error) {
    console.error(error);
  }
};

const viewDescription = (item) => {
  viewProduct.value = item;
  viewVisible.value = true;
};

const onPageChange = (event) => {
  page.value = event.page + 1;
  limit.value = event.rows;
  getProductHistory();
};

onMounted(getProductHistory);
</script>
