module.exports = {
  // Special alias to host loopback interface in cordova
  //domain: 'http://10.0.2.2:8081',
  // If using port forwarding
  //domain: 'http://localhost:8081',
  // If using local IP on WiFi router
  domain: 'http://192.168.1.16:8081',
  apiPath: '/api',
  transport: 'websocket', // Could be 'http' or 'websocket',
  appName: 'kApp',
  appLogo: 'kalisio-logo.png',
  publisher: {
    name: 'Kalisio',
    website: 'https://www.kalisio.xyz',
    contact: 'support@kalisio.xyz'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  screen: {
    footer: [
      { label: 'About Kalisio', url: 'https://www.kalisio.xyz' },
      { label: 'Contact', url: 'https://www.kalisio.xyz/contact' },
      { label: 'Terms & Policies', url: 'https://www.kalisio.xyz/terms' },
    ],
    header: 'kalisio-banner.png'
  },
  login: {
    providers: ['google', 'github']
  },
  layout: {
    appBar: 'layout/KAppBar',
    sideNav: 'layout/KSideNav'
  },
  appBar: {
    title: 'kApp',
    subtitle: 'A template application powered by Kalisio',
    speech: {
      language: 'en'
    }
  },
  sideNav: {
    user_identity: 'account/KIdentityPanel',
    user_organisation: 'KOrganisationsPanel',
    user_actions: 'layout/KLinksPanel'
  },
  user_identity: {
  },
  user_organisations: {
    icon: 'domain',
    label: 'Organisations',
    bgColor: 'bg-faded',
    textColor: 'text-light'
  },
  user_actions: {
    links: [
      { }, // separator
      { label: 'Logout', icon: 'exit_to_app', route: { name: 'logout' } }
    ]
  },
  organisationView: {
    actions: [
      { icon: 'map', route: { name: 'map', params: {} } },
      { icon: 'terrain', route: { name: 'globe', params: {} } },
      { icon: 'group', route: { name: 'members-activity', params: {} } },
      { icon: 'folder', route: { name: 'groups-activity', params: {} } },
      { icon: 'settings', route: { name: 'settings-activity', params: { perspective: 'properties' } } }
    ]
  },
  map: {
    baseLayers: [
      {
        type: 'tileLayer',
        arguments: [
          'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
          {
            maxZoom: 20,
            label: 'Streets',
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          }
        ]
      },
      {
        type: 'tileLayer',
        arguments: [
          'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
          {
            maxZoom: 20,
            label: 'Satellite',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
                        'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          }
        ]
      },
      {
        type: 'tileLayer',
        arguments: [
          'http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png',
          {
            maxZoom: 20,
            label: 'Neutral',
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
                         'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          }
        ]
      },
      {
        type: 'tileLayer.wms',
        arguments: [
          'https://geoservices.meteofrance.fr/api/__1sTDhRuCpiY-Be1-yROnR2E4VKXbZk46Ry3oeZjBNSg__/PPERO_01WMS',
          {
            layers: 'FL__ISO_0',
            version: '1.3.0',
            transparent: true,
            crs: 'EPSG3857',
            format: 'image/png',
            dim_reference_time: '2017-10-12T00:00:00Z',
            time: '2017-10-13T00:00:00Z',
            styles: 'FLP__ISO_0__NO_SHADING',
            //  elevation: '100',
            uppercase: true,
            maxZoom: 20,
            label: 'MF-FL_ISO_0'
          }
        ]
      }   
    ],
    // Default GeoJSON layer style for polygons/lines
    featureStyle: {
      opacity: 1,
      radius: 6,
      color: 'red',
      fillOpacity: 0.5,
      fillColor: 'green',
      popup: {
        excludedProperties: ['wikipedia']
      }
    },
    // Default GeoJSON layer style for points
    pointStyle: {
      type: 'circleMarker',
      options: {
        opacity: 1,
        color: 'red',
        fillOpacity: 0.5,
        fillColor: 'green'
      }
    }
  },
  globe: {
    viewer: {
      sceneMode : 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
      sceneModePicker : false,
      scene3DOnly : true,
      homeButton : false,
      geocoder : false,
      navigationHelpButton : true,
      baseLayerPicker : true,
      vrButton: true,
      animation: false,
      //creditContainer: 'xxx',
      timeline: false
    },
    baseLayers: [{
      name: 'Mapbox Satellite',
      tooltip: 'Mapbox satellite imagery https://www.mapbox.com/maps/',
      iconUrl: 'Widgets/Images/ImageryProviders/mapboxSatellite.png',
      type: 'Mapbox',
      mapId: 'mapbox.satellite'
    }, {
      name: 'Mapbox Streets',
      tooltip: 'Mapbox streets imagery https://www.mapbox.com/maps/',
      iconUrl: 'Widgets/Images/ImageryProviders/mapboxTerrain.png',
      type: 'Mapbox',
      mapId: 'mapbox.streets'
    }],
    terrainLayers: [{
      name : 'WGS84 Ellipsoid',
      iconUrl: 'Widgets/Images/TerrainProviders/Ellipsoid.png',
      tooltip : 'WGS84 standard ellipsoid, also known as EPSG:4326',
      type: 'Ellipsoid'
    }, {
      name : 'STK World Terrain meshes',
      iconUrl : 'Widgets/Images/TerrainProviders/STK.png',
      tooltip : 'High-resolution, mesh-based terrain for the entire globe. Free for use on the Internet. Closed-network options are available.\nhttp://www.agi.com',
      type: 'Cesium',
      url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
      requestWaterMask : true,
      requestVertexNormals : true
    }],
    fileLayers: {
      clearOnDrop : false,
      flyToOnDrop: true,
      clampToGround: true
    },
    // Default GeoJSON layer style for points/polygons/lines in simple style spec
    featureStyle: {
      'marker-symbol': 'airport',
      'marker-color': '#57D824'
    }
  },
  routes: {
    '/' : {
      name: 'index',
      component: 'Index',
      // By default all child routes are considered unauthenticated,
      // will be overriden when required
      meta: { unauthenticated: true },
      children: {
        'login': 'authentication/KLogin',
        'logout': {
          component: 'authentication/KLogout',
          meta: { authenticated: true }
        },
        'register': 'authentication/KRegister',
        'change-endpoint': 'authentication/KChangeEndpoint',
        'resend-verify-signup': 'account/KResendVerifySignup',
        'verify-signup/:token': 'account/KVerifySignup',
        'send-reset-password': 'account/KSendResetPassword',
        'change-password': {
          component: 'account/KChangePassword',
          meta: { authenticated: true, unauthenticated: false }
        },
        'reset-password/:token': 'account/KResetPassword',
        'send-change-identity': {
          component: 'account/KSendChangeIdentity',
          meta: { authenticated: true, unauthenticated: false }
        },
        'change-identity/:token': 'account/KChangeIdentity',
        'home': {
          component: 'layout/KHome',
          meta: { authenticated: true, unauthenticated: false },
          children: {
            'account/:perspective': {
              name: 'account-activity',
              component: 'account/KAccountActivity',
              props: true
            },
            ':contextId': {
              name: 'organisation-view',
              component: 'KOrganisationView',
              props: true,
              children: {
                'map': {
                  component: 'KMap'
                },
                'globe': {
                  component: 'KGlobe'
                },
                'members/:id?/:perspective?': {
                  name: 'members-activity',
                  component: 'KMembersActivity',
                  props: true
                },
                'groups/:id?/:perspective?': {
                  name: 'groups-activity',
                  component: 'KGroupsActivity',
                  props: true
                },
                ':perspective': {
                  name: 'settings-activity',
                  component: 'KSettingsActivity',
                  props: true
                }
              }
            }
          }
        }
      }
    },
    '*': 'Error404'
  }
}
