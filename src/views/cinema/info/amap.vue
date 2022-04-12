<template>
  <div ref="wrapRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, unref, onMounted, computed } from 'vue';
  import { cinfo, getCInfo, isCreate } from './data';
  import { regeoApi } from '/@/api/demo/cinema';
  import { useScript } from '/@/hooks/web/useScript';

  const A_MAP_URL = 'https://webapi.amap.com/maps?v=2.0&key=fbc2c5494c747e43bea1e4ec3981bd05';

  export default defineComponent({
    name: 'AMap',
    props: {
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: 'calc(100vh - 78px)',
      },
      fn: {
        type: Function,
      },
    },
    emits: ['back'],
    setup(props, context) {
      const wrapRef = ref<HTMLDivElement | null>(null);
      const { toPromise } = useScript({ src: A_MAP_URL });
      let center = [113.444729, 23.375283];
      async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const AMap = (window as any).AMap;
        const map = new AMap.Map(wrapEl, {
          zoom: 13,
          center: center,
          viewMode: '3D',
        });
        var marker = new AMap.Marker({
          position: center, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        map.add(marker);
        map.on('click', async function (ev) {
          var lnglat = ev.lnglat;
          marker._position = lnglat;
          const data = await regeoApi('&location=' + lnglat);
          let province = data.regeocode.addressComponent.province,
            city = data.regeocode.addressComponent.city,
            district = data.regeocode.addressComponent.district;
          let cinfo = props.fn();
          cinfo['address'] = data.regeocode.formatted_address;
          cinfo.city = city;
          cinfo.province = province;
          cinfo.district = district;
          cinfo.location = cinfo.address
            .replace(province, '')
            .replace(city, '')
            .replace(district, '');
          cinfo.latitude = lnglat.lat;
          cinfo.longitude = lnglat.lng;
          context.emit('back', cinfo);
        });
      }

      onMounted(() => {
        if (!isCreate.value) {
          getCInfo()
            .then(() => {
              if (cinfo.value.longitude != 0 && cinfo.value.latitude != 0)
                center = [cinfo.value.longitude, cinfo.value.latitude];

              console.log(center);
            })
            .finally(() => {
              context.emit('back', cinfo.value);
            });
        }
        initMap();
      });

      return { wrapRef };
    },
  });
</script>
