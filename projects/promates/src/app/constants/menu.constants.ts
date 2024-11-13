import { APP_PATHS } from './app.constants'; // Import the paths

export const MENU_DATA = [
  {
    name: 'About Us',
    icon: '',
    id: 'about',
    subnav: [],
    path: APP_PATHS.ABOUT // Use the path from APP_PATHS
  },
  {
    name: 'For Business',
    icon: '',
    id: 'forbusiness',
    subnav: [
      {
        name: 'Services',
        id: 'services', // Add an id for the subnav
        icon: '',
        subchildren:[
          {
            name: 'Staffing',
            id: 'staffing',
            icon: '',
            path: APP_PATHS.STAFFING
          },
          {
            name: 'Consulting',
            id: 'consulting',
            icon: '',
          }
        ]
      },
      {
        name: 'Industries',
        id: 'industries', // Add an id for the subnav
        icon: '',
        subchildren: [
          {
            name: 'Finance',
            icon: '',
            id: 'finance', // Add an id for the child
            path: APP_PATHS.INDUSTRIES.FINANCE // Ensure this path is correct
          },
          {
            name: 'Health Care',
            icon: '',
            id: '',
            path: APP_PATHS.INDUSTRIES.HEALTH_CARE
          },
          {
            name: 'Information Technology',
            icon: '',
            id: '',
            path: APP_PATHS.INDUSTRIES.IT
          },
          {
            name: 'Retail',
            icon: '',
            id: '',
            path: APP_PATHS.INDUSTRIES.RETAIL
          },
          {
            name: 'Life Sciences',
            icon: '',
            id: '',
            path: APP_PATHS.INDUSTRIES.LIFE_SCIENCES
          },
          {
            name: 'Logistics',
            icon: '',
            id: '',
            path: APP_PATHS.INDUSTRIES.LOGISTICS
          },
        ],
      },
    //   {
    //     name: 'Staffing',
    //     id: 'staffing',
    //     icon: '',
    //     subchildren: [
    //       {
    //         name: 'Contract',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.STAFFING.CONTRACT
    //       },
    //       {
    //         name: 'Contract To Hire',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.STAFFING.CONTRACT_TO_HIRE
    //       },
    //       {
    //         name: 'Direct Placement',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.STAFFING.DIRECT_PLACEMENT
    //       },
    //       {
    //         name: 'Offshore Resources',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.STAFFING.OFFSHORE_RESOURCES
    //       },
    //     ],
    //   },
    //   {
    //     name: 'Consulting',
    //     id: 'consulting',
    //     icon: '',
    //     subchildren: [
    //       {
    //         name: 'Cloud Services',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.CONSULTING.CLOUD_SERVICES
    //       },
    //       {
    //         name: 'Engineering',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.CONSULTING.ENGINEERING
    //       },
    //       {
    //         name: 'Support Consulting',
    //         icon: '',
    //         id: '',
    //         path: APP_PATHS.CONSULTING.SUPPORT
    //       },
    //     ],
    //   },
     ],
  },
  // {
  //   name: 'Insights',
  //   icon: '',
  //   id: 'insights',
  //   subnav: [],
  //   path: APP_PATHS.INSIGHTS // Use the path from APP_PATHS
  // },
  {
    name: 'For Job Seekers',
    icon: '',
    id: 'jobseeker',
    subnav: [
      {
        name: 'Search Jobs',
        id: 'searchjobs', // Add an id for the subnav
        icon: '',
      },
      {
        name: 'Submit Resume',
        id: 'submit Resume', // Add an id for the subnav
        icon: '',
      }
    ],
    // path: APP_PATHS.JOB_SEEKER // Use the path from APP_PATHS
  },
  {
    name: 'Contact',
    icon: '',
    id: 'contact',
    subnav: [],
    path: APP_PATHS.CONTACT // Use the path from APP_PATHS
  },
];
