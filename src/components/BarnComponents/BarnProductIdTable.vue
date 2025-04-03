<template>
  <div class="relative overflow-x-auto shadow-md rounded">
    <table
      class="min-w-[1400px] text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-2 py-3">Haridor</th>
          <th scope="col" class="px-2 w-40 py-3">Tell</th>
          <th scope="col" class="px-2 w-28 py-3">Sotildi KG</th>
          <th scope="col" class="px-2 w-32 py-3">1 kg uchun</th>
          <th scope="col" class="px-2 w-40 py-3">Asl narxi 1 kg</th>
          <th scope="col" class="px-2 min-w-52 py-3">Tushkan summa</th>
          <th scope="col" class="px-2 min-w-52 py-3">Sof foyda</th>
          <th scope="col" class="px-2 w-40 py-3">Sotilgan vaqti</th>
          <th scope="col" class="px-2 py-3">O'chirish</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, itemKey) in productHistory?.history"
          :key="itemKey"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
        >
          <th
            scope="row"
            class="px-2 text-wrap py-4 font-medium text-gray-900 dark:text-white"
          >
            <p class="w-56 overflow-hidden whitespace-nowrap text-ellipsis">
              {{ item?.name }}
            </p>
          </th>
          <td class="px-2 py-4">
            {{ item?.phone }}
          </td>
          <td class="px-2 py-4">{{ item?.size }} kg</td>
          <td class="px-2 py-4">
            {{ formatCurrency(item?.sellingPrice) }}
          </td>
          <td class="px-2 py-4">
            {{ formatCurrency(item?.originalPrice) }}
          </td>
          <td class="px-2 py-4">
            {{ formatCurrency(item?.totalAmount) }}
          </td>
          <td class="px-2 py-4">
            {{ formatCurrency(item?.profit) }}
          </td>
          <td class="px-2 py-4">
            {{ formatDateTime(item?.createdAt) }}
          </td>
          <td class="px-2 py-4 flex justify-center items-center gap-2">
            <button
              @click="deleteProductHistory(item?._id)"
              class=""
            >
               <i class="pi pi-trash text-red-500"></i>
            </button>
            <button @click="viewDiscreption(item)" class="">
              <i class="pi pi-eye"></i>
            </button>
          </td>
        </tr>
        <tr :class="productHistory?.history ? 'hidden' : ''">
          <td
            colspan="9"
            class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            Sotilgan ma'lumotlar yo'q
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Begin Pagenation component -->
  <div class="flex flex-col items-center space-y-2 mt-4">
    <div class="flex items-center space-x-2">
      <button
        class="px-4 py-2 border rounded-md bg-gray-100"
        :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
        :disabled="page === 1"
        @click="prevPage"
      >
        Orqaga
      </button>

      <div class="flex space-x-1">
        <button
          v-for="p in pageNumbers"
          :key="p"
          @click="setPage(p)"
          class="px-3 py-1 border rounded-md"
          :class="{
            'bg-blue-500 text-white': page === p,
            'hover:bg-gray-200': page !== p,
          }"
        >
          {{ p }}
        </button>
      </div>

      <button
        class="px-4 py-2 border rounded-md bg-gray-100"
        :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
        :disabled="page === totalPages"
        @click="nextPage"
      >
        Keyingi
      </button>
    </div>
  </div>
  <!-- End Pagenation component -->
  <!-- Begin view discription -->
  <div :class="viewVizible ? 'flex  overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full' : 'hidden'">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white border rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ viewProduct?.name }}
                </h3>
                <button @click="viewVizible=false" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                 {{ viewProduct?.description ? viewProduct?.description : "Tafsilotlar mavjut emas!" }}
                </p>
            </div>
        </div>
    </div>
</div>
  <!-- End view discription -->
</template>
<script setup>
import axios from "axios";
import formatCurrency from "../../utils/PriceFormatter";
import formatDateTime from "../../utils/DateTimeFormatter";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
const id = useRoute().params.id;

const productHistory = ref(null);
const page = ref(1);
const limit = ref(5);
const totalItems = ref(null); // Jami elementlar soni
const viewVizible=ref(false);

const viewProduct = ref(null);
const getProductHistory = async () => {
  try {
    const response = await axios.get(
      `/api/product-history/${id}?page=${page.value}&limit=${limit.value}`
    );
    productHistory.value = response.data;
    // limit.value = response.data.limit
    totalItems.value = response.data.total;
    console.log(productHistory.value);
  } catch (error) {
    console.error(error);
  }
};
const viewDiscreption= async (item) => {
  viewVizible.value=true
  viewProduct.value=item
}

const deleteProductHistory = async (itemId) => {
  try {
    await axios.delete(`/api/product-history/delete/${itemId}`);
         Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: `Ma'lumot o'chirildi`,
                    showConfirmButton: false,
                    timer: 1500
                });
    getProductHistory();
  } catch (error) {
    console.error(error);
  }
};

const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));

// Sahifalar ro‘yxatini yaratish
const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1)
);

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    getProductHistory();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    getProductHistory();
  }
};

const setPage = (p) => {
  page.value = p;
  getProductHistory();
};

watch(limit, () => {
  page.value = 1; // Limit o'zgarganda birinchi sahifaga qaytish
});
onMounted(() => {
  getProductHistory();
});
</script>
