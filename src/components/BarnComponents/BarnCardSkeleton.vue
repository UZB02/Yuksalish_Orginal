<template>
     <Card v-for="index in 3" :key="index">
        <template #title>
            <div class="flex justify-between items-center border-b-2 pb-2">
                <Skeleton width="20%" height="1rem" />
                <Skeleton width="4rem" height="2rem" />
            </div>
        </template>
        <hr width="100%">
        <template #content>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-5 border-b-2 pb-4">
                    <div class="flex justify-between">
                        <div class="flex flex-col gap-2">
                            <Skeleton width="60px" height="10px" />
                            <Skeleton width="80px" height="1rem" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Skeleton width="60px" height="10px" />
                            <Skeleton width="100px" height="1rem" />
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div class="flex flex-col gap-2">
                            <Skeleton width="60px" height="10px" />
                            <Skeleton width="80px" height="1rem" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Skeleton width="80px" height="10px" />
                            <Skeleton width="100px" height="1rem" />
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <Skeleton width="100%" height="2rem" />
                    <Skeleton width="100%" height="2rem" />
                </div>
            </div>
        </template>
    </Card>
</template>
<script setup></script>

