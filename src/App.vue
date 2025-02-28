<template>
  <div class="app-content">
    <Tabs v-model:value="curCat">
      <TabList>
        <Tab v-for="(cat, index) in cats" :key="index" :value="cat.id">
          <OverlayBadge :value="cat.num">
            <Chip :label="cat.name" />
          </OverlayBadge>
        </Tab>
        <Button class="edit-button" label="edit" @click="visible = true" />
      </TabList>
      <TabPanels>
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
          <div class="app-footer">
            <OverlayBadge :value="((cat.weight * cat.dayDoze) / cat.gs).toFixed(2)">
              <Chip :label="`${cat.weight} kg`" />
            </OverlayBadge>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog
      v-model:visible="visible"
      modal
      header="Edit Profile"
      :style="{ width: '25rem' }"
    >
      <Fieldset :legend="cat.name" v-for="(cat, index) in cats" :key="index">
        <div>
          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catName" v-model="cat.name" />
              <label for="catName">name</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catWeight" v-model="cat.weight" />
              <label for="catWeight">weight</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catGS" v-model="cat.gs" />
              <label for="catGS">gs-441524 concentration</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="catdayDoze" v-model="cat.dayDoze" />
              <label for="catdayDoze">gs-441524 daydoze</label>
            </FloatLabel>
          </div>

          <div class="app-cat-profile">
            <FloatLabel>
              <InputText id="injectionCount" v-model="cat.num" />
              <label for="injectionCount">injection</label>
            </FloatLabel>
          </div>

          <Button icon="pi pi-trash" @click="removeCat(index)" severity="danger" />
        </div>
      </Fieldset>

      <Toolbar>
        <template #start>
          <Button icon="pi pi-plus" @click="addCat()" />
        </template>
        <template #end> <Button label="Save" @click="saveCats(true)" /></template>
      </Toolbar>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
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

const availablePoints = [1, 4, 5, 2, 3, 6];

const visible = ref(false);

const curCat = ref(0);

const cats = ref([]);

fillPoints();

function addCat() {
  cats.value.push({
    id: cats.value?.length ?? 0,
    name: "",
    weight: null,
    num: 1,
    gs: 30,
    dayDoze: 8,
    schema: availablePoints,
    points: generatePoints(availablePoints),
  });
  saveCats();
}

function removeCat(index) {
  cats.value.splice(index, 1);
  saveCats();
}

function saveCats(closeWin) {
  localStorage.setItem("fipWarriorCats", JSON.stringify(cats.value));
  if (closeWin) {
    visible.value = false;
  }
}

function generatePoints(schema) {
  const pointsArr = [];
  for (let i = 0; i < schema.length; i++) {
    pointsArr.push({
      active: i == 0,
      value: i + 1,
      visible: true,
      disabled: false,
    });
  }
  return pointsArr;
}

function fillPoints() {
  const catsArr = JSON.parse(localStorage.getItem("fipWarriorCats") ?? "[]");
  cats.value = catsArr;
}

function markPoint() {
  const cat = cats.value[curCat.value];
  const activePoint = cat.points.find((item) => item.active);
  let schemaIndex = cat.schema.findIndex((v) => v === activePoint.value);
  schemaIndex++;

  if (schemaIndex >= cat.schema?.length) {
    schemaIndex = 0;
  }
  const nextPoint = cat.points.find((item) => item.value === cat.schema[schemaIndex]);
  activePoint.active = false;
  nextPoint.active = true;
  cat.num++;
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
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    > * {
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &-header {
    height: 4rem;
    z-index: 100;
    display: flex;
    padding: 1rem;
    > * {
      margin-left: 1rem;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &-cat-profile {
    margin-top: 1rem;
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
    align-items: flex-end;
    padding-bottom: 2rem;
    grid-gap: 0.5rem;
    > * {
      align-self: center;
      justify-self: center;
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
</style>
