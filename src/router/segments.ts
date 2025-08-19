import segments from '../views/pages/segments/segments.vue';
import segmentPage from '../views/pages/segments/segmentPage.vue';
import segmentBuilder from '../views/pages/segments/segmentBuilder.vue';

export default [
  {
    path: '/segments',
    children: [
      {
        path: '',
        name: 'Segments',
        component: segments,
      },
      {
        path: 'createsegment',
        name: 'Create segment',
        component: segmentBuilder,
      },
      {
        path: 'editsegment/:id',
        name: 'Edit segment',
        component: segmentBuilder,
      },
      {
        path: 'segment/:id',
        name: 'Segment page',
        component: segmentPage,
      },
    ],
  },
];
