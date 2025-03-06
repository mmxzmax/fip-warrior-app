<template>
  <div class="app-content">
    <Tabs v-model:value="curCat">
      <TabList>
        <Tab v-for="(cat, index) in cats" :key="index" :value="cat.id">
          <OverlayBadge :value="cat.num">
            <Chip :label="cat.name" />
          </OverlayBadge>
        </Tab>
      </TabList>
      <TabPanels v-if="cats?.length">
        <TabPanel v-for="(cat, index) in cats" :key="index" :value="cat.id">
          <div class="app-main">
            <svg
              viewBox="0 0 210 297"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:svg="http://www.w3.org/2000/svg"
            >
              <path
                d="M 209.05265,251.28502 C 196.24401,171.51603 158.327,6.3946197 158.32771,6.388979 c -0.46331,-2.56146 -2.31727,-4.4243387 -4.86629,-5.12292 -2.31736,-0.69853962 -5.09812,0 -6.9519,1.8628788 l -9.96443,10.0129672 c -6.9519,7.218664 -15.85882,17.117273 -26.05498,17.117273 -10.19616,0 -20.291082,-9.898609 -27.242996,-17.117273 L 73.282706,3.1289378 C 71.428924,1.266059 68.879818,0.56747783 66.330792,1.266059 c -2.549013,0.6985329 -4.402886,2.7943181 -4.866288,5.12292 0,0 -44.416077,162.926631 -59.0047257,243.111091 -1.52064919,76.02646 205.7395117,75.01994 206.5928717,1.78495 z"
                fill="#444b54"
                clip-path="none"
                style="stroke-width: 2.32294"
              />
            </svg>
            <Button
              v-if="cats?.length"
              class="share-button"
              icon="pi pi-qrcode"
              @click="getQrCode(!!cats?.length)"
            />
            <div class="app-injection-field">
              <div
                v-for="(item, index) in cat.points"
                :key="item.value"
                class="app-injection-point"
              >
                <OverlayBadge :value="index + 1">
                  <Button
                    v-if="item.active"
                    @click="markPoint()"
                    icon="pi pi-check"
                    rounded
                  />
                  <Button
                    v-if="!item.active"
                    disabled="true"
                    icon="pi pi-times"
                    severity="danger"
                    rounded
                  />
                </OverlayBadge>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
      <Toolbar class="app-footer">
        <template #start>
          <Chip v-if="cats?.length" :label="`${selectedCat?.weight} kg`" />
        </template>
        <template #center
          ><Chip
            v-if="cats?.length"
            :label="`${(
              (selectedCat?.weight * selectedCat?.dayDoze) /
              selectedCat?.gs
            ).toFixed(2)} ml`"
        /></template>
        <template #end>
          <Button
            v-if="cats?.length"
            style="margin-right: 1rem"
            icon="pi pi-forward"
            @click="markPoint(false)"
          />
          <Button
            v-if="cats?.length"
            style="margin-right: 1rem"
            label="Пропустить"
            @click="markPoint(true)"
          />
          <Button
            style="margin-left: auto"
            v-if="cats?.length"
            class="edit-button"
            icon="pi pi-pencil"
            @click="visible = true"
          />
          <Button style="margin-left: 1rem" icon="pi pi-plus" @click="addCat()" />
          <Button
            :style="{ 'margin-left': 'auto' }"
            v-if="!cats?.length"
            icon="pi pi-qrcode"
            @click="getQrCode(false)"
          />
        </template>
      </Toolbar>
    </Tabs>

    <Dialog
      v-model:visible="visible"
      modal
      header="Редактировать питомца"
      :style="{ width: '25rem' }"
    >
      <Fieldset v-if="cats?.length">
        <div>
          <Toolbar>
            <template #start>{{ selectedCat?.name }}</template>
            <template #end
              ><Button
                icon="pi pi-trash"
                @click="removeCat(selectedCat?.id)"
                severity="danger"
            /></template>
          </Toolbar>
          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catName" v-model="selectedCat.name" />
              <label for="catName">Кличка</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catWeight" v-model="selectedCat.weight" />
              <label for="catWeight">Вес</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catGS" v-model="selectedCat.gs" />
              <label for="catGS">концентрация gs-441524</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catdayDoze" v-model="selectedCat.dayDoze" />
              <label for="catdayDoze">доза на 1 кг</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="injectionCount" v-model="selectedCat.num" />
              <label for="injectionCount">Какая инъекция по счету</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <ol class="app-schema">
              <li v-for="(point, index) in selectedCat?.points" :key="index">
                <Button
                  :label="schemaEditorState[index] ? selectedCat.schema[index] : '*'"
                  @click="markSchemaPoint(selectedCat, index)"
                />
              </li>
            </ol>

            <Toolbar>
              <template #start>
                <Button icon="pi pi-minus" @click="deletePoints(selectedCat)" />
              </template>
              <template #end
                ><Button icon="pi pi-plus" @click="addPoints(selectedCat)"
              /></template>
            </Toolbar>
          </div>
        </div>
      </Fieldset>

      <Toolbar>
        <template #end> <Button label="Сохранить" @click="saveCats(true)" /></template>
      </Toolbar>
    </Dialog>

    <Dialog v-model:visible="qrVisible" modal header="Поделиться">
      <img :src="qrImg" />
      <Toolbar>
        <template #end><Button label="Скопировать url" @click="shareLinkUrl()" /></template>
      </Toolbar>
    </Dialog>

    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Button from "primevue/button";
import "primeicons/primeicons.css";
import OverlayBadge from "primevue/overlaybadge";
import Chip from "primevue/chip";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Fieldset from "primevue/fieldset";
import Toolbar from "primevue/toolbar";
import QRCode from "qrcode";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { onMounted } from "vue";
import { setData, allData, delData, getData } from "./db/db";

const confirm = useConfirm();

const toast = useToast();

const availablePoints = [1, 4, 5, 2, 3, 6];

const visible = ref(false);

const qrVisible = ref(false);

const qrImg = ref("");

const qrUrl = ref("");

const curCat = ref(0);

const cats = ref([]);

let schemaCounter = 0;
let schemaEditorState = ref([]);

const selectedCat = computed(() => getCurrentCat());

async function getQrCode(exportCat = false) {
  const url = new URL(window.location.href);
  if (exportCat) {
    const { guid, name, weight, num, gs, dayDoze, schema, points } = selectedCat.value;
    const dataStr = `${guid}|${name}|${weight}|${num}|${gs}|${dayDoze}|${schema.join(
      ","
    )}|${points?.find((item) => item.active)?.value}`;
    url.searchParams.set("add", btoa(encodeURIComponent(dataStr)));
  }
  qrUrl.value = url.toString();
  qrImg.value = await QRCode.toDataURL(qrUrl.value);

  qrVisible.value = true;
}

async function shareLinkUrl() {
  await navigator.clipboard.writeText(qrUrl.value);
  toast.add({ severity: "success", summary: "Успех", detail: "url Скопирован", life: 3000 });
}

onMounted(async () => {
  fillPoints();
});

async function generateGuid() {
  const res = await axios.get("https://www.uuidgenerator.net/api/version4");
  return res.data;
}

async function addCat(
  data = {
    guid: null,
    name: "",
    weight: null,
    num: 1,
    gs: 30,
    dayDoze: 8,
    schema: [...availablePoints],
    activePoint: 1,
  },
  showEdit = true
) {
  const nextId = cats.value?.length
    ? cats.value
        ?.map((item) => item.id)
        .sort()
        .reverse()[0] + 1
    : 0;
  cats.value.push({
    id: nextId,
    guid: data.guid ?? (await generateGuid()),
    name: data.name,
    weight: data.weight,
    num: data.num,
    gs: data.gs,
    dayDoze: data.dayDoze,
    schema: data.schema,
    points: generatePoints(data.schema, data.activePoint),
  });
  await saveCats();
  curCat.value = nextId;
  if (showEdit) {
    visible.value = true;
  }
}

function removeCat(id) {
  if (id === undefined) {
    return;
  }

  const index = cats.value.findIndex((cat) => cat.id == id);
  const guid = cats.value[index].guid;
  const name = cats.value[index].name;
  confirm.require({
    message: `Удалить питомца ${name} ?`,
    header: "Подтвердите удаление",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Отмена",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Удалить",
    },
    accept: async () => {
      visible.value = false;
      cats.value.splice(index, 1);
      await delData(guid);
      curCat.value = cats.value[0]?.id ?? 0;
      await saveCats();
      toast.add({
        severity: "success",
        summary: "Удаление успешно",
        detail: `Питомец ${name} удален`,
        life: 3000,
      });
    },
  });
}

async function saveCats(closeWin) {
  if (closeWin) {
    cats.value.forEach((cat) => {
      const fixedSchema = [];
      cat.schema.forEach((item, index) => {
        const i = cat.schema.findIndex((v) => v == index + 1);
        if (i !== -1) {
          fixedSchema.push(i + 1);
        }
      });
      cat.schema = fixedSchema;
      if (schemaEditorState.value?.length) {
        cat.points.forEach((point) => {
          point.active = point.value == cat.schema[0];
        });
      }
    });
    schemaEditorState.value = [];
  }
  for (let cat of cats.value) {
    const { guid, ...data } = cat;
    await setData(guid, {
      ...data,
      points: data.points.map((item) => ({ ...item })),
      schema: data.schema.map((item) => item),
    });
  }
  if (closeWin) {
    visible.value = false;
  }
}

function generatePoints(schema, activePointValue = 1) {
  const pointsArr = [];
  for (let i = 0; i < schema.length; i++) {
    pointsArr.push({
      active: activePointValue == i + 1,
      value: i + 1,
      visible: true,
      disabled: false,
    });
  }
  return pointsArr;
}

async function fillPoints() {
  const dataKeys = await allData();
  const catsArr = [];
  for (let guid of dataKeys) {
    const v = await getData(guid);
    catsArr.push({ guid, ...v });
  }
  cats.value = catsArr.reverse();
  curCat.value = cats.value[0]?.id ?? 0;
  const searchParams = new URLSearchParams(window.location.search);
  const data = searchParams.get("add");
  window.history.pushState({}, document.title, window.location.pathname);
  if (data) {
    const [
      guid,
      name,
      weight,
      num,
      gs,
      dayDoze,
      schema,
      activePoint,
    ] = decodeURIComponent(atob(data)).split("|");
    const newCat = {
      guid,
      name,
      weight,
      num,
      gs,
      dayDoze,
      schema: schema.split(",").map((item) => +item),
      activePoint,
    };
    const existCat = catsArr.find((c) => c.guid == newCat.guid);
    if (existCat) {
      confirm.require({
        message: `Питомец ${newCat.name} уже существует, обновить?`,
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "Отменить",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Обновить",
        },
        accept: async () => {
          existCat.name = newCat.name;
          existCat.weight = newCat.weight;
          existCat.num = newCat.num;
          existCat.gs = newCat.gs;
          existCat.dayDoze = newCat.dayDoze;
          existCat.schema = newCat.schema;
          existCat.points = generatePoints(newCat.schema, newCat.activePoint);
          await saveCats();
          await fillPoints();
          toast.add({
            severity: "success",
            summary: "Обновление успешно завершено",
            detail: `Данные питомца ${existCat.name} успешно обновлены`,
            life: 3000,
          });
        },
      });
    } else {
      confirm.require({
        message: `Добавить нового питомца ${newCat.name}?`,
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "Отменить",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Добавить",
        },
        accept: async () => {
          await addCat(newCat, false);
          toast.add({
            severity: "success",
            summary: "Добавление завершено",
            detail: `Питомец ${newCat.name} добавлен`,
            life: 3000,
          });
        },
      });
    }
  }
}

function getCurrentCat() {
  return cats.value.find((cat) => cat.id == curCat.value);
}

function addPoints(cat) {
  cat.schema.push(cat.schema.length + 1, cat.schema.length + 2);
  cat.points = generatePoints(cat.schema);
  saveCats();
}

function deletePoints(cat) {
  cat.schema.splice(cat.schema.length - 2, 2);
  cat.points = generatePoints(cat.schema);
  saveCats();
}

function markSchemaPoint(cat, index) {
  cat.schema[index] = schemaCounter + 1;
  schemaCounter++;
  schemaEditorState.value[index] = true;
  if (schemaCounter >= cat.schema.length) {
    schemaCounter = 0;
  }
}

function markPoint(skipCouter = false) {
  const cat = getCurrentCat();
  const activePoint = cat.points.find((item) => item.active);
  let schemaIndex = cat.schema.findIndex((v) => v == activePoint.value);
  schemaIndex++;

  if (schemaIndex >= cat.schema?.length) {
    schemaIndex = 0;
  }
  const nextPoint = cat.points.find((item) => item.value == cat.schema[schemaIndex]);
  activePoint.active = false;
  nextPoint.active = true;
  if (!skipCouter) {
    cat.num++;
  }
  saveCats();
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.app {
  &-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .p-tabpanels {
      height: 100%;
      min-height: 1rem;
      position: relative;
      .p-tabpanel {
        height: 100%;
        position: relative;
      }
    }
  }
  &-main {
    width: 100%;
    height: 100%;
    min-height: 1rem;
    display: flex;
    align-items: flex-end;
    position: relative;
    svg {
      width: 100%;
      max-height: 100%;
    }
  }
  &-footer {
    .p-toolbar-end {
      width: 100%;
    }
  }
  &-cat-profile {
    margin-top: 1.75rem;
    input {
      width: 100%;
    }
  }
  &-injection-field {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    height: 75%;
    display: grid;
    grid-template-columns: 50% 50%;
    width: 35vh;
    max-width: 100%;
    align-items: flex-end;
    padding-bottom: 2rem;
    grid-gap: 0.5rem;
    > * {
      align-self: center;
      justify-self: center;
    }
  }
  &-schema {
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 0.5rem;
    margin-bottom: 1rem;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      .p-inputtext {
        width: 4rem;
      }
    }
  }
}
.edit-button {
  margin-left: auto;
}
.p-tabs {
  height: 100%;
}
.p-tabpanels {
  height: 100%;
}
.share-button {
  position: absolute !important;
  top: 1rem;
  right: 1rem;
}
</style>
