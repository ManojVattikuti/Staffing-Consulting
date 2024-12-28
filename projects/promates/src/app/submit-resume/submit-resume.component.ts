import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/api-invoker.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-submit-resume',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './submit-resume.component.html',
  styleUrl: './submit-resume.component.scss'
})
export class SubmitResumeComponent implements OnInit {
  resumeForm!: FormGroup;
  constructor(private fb: FormBuilder,
    public notificationService: NotificationService,
    private serviceInvoker: ServiceInvokerService
  ) { }
  dropdownValues: any = {};
  gendersArray = [
    {
      value: 'male',
      title: "Male"
    },
    {
      value: 'female',
      title: "Female"
    }
  ];
  countries = [
    {
      name: 'United States',
      code: 'US',
      states: [
        { name: 'California', code: 'CA' },
        { name: 'Texas', code: 'TX' },
        { name: 'New York', code: 'NY' },
        { name: 'Florida', code: 'FL' },
        { name: 'Illinois', code: 'IL' },
        { name: 'Pennsylvania', code: 'PA' },
        { name: 'Ohio', code: 'OH' },
        { name: 'Georgia', code: 'GA' },
        { name: 'North Carolina', code: 'NC' },
        { name: 'Michigan', code: 'MI' },
        { name: 'New Jersey', code: 'NJ' },
        { name: 'Virginia', code: 'VA' },
        { name: 'Washington', code: 'WA' },
        { name: 'Arizona', code: 'AZ' },
        { name: 'Massachusetts', code: 'MA' }
      ]
    },
    {
      name: 'Canada',
      code: 'CA',
      states: [
        { name: 'Ontario', code: 'ON' },
        { name: 'Quebec', code: 'QC' },
        { name: 'British Columbia', code: 'BC' },
        { name: 'Alberta', code: 'AB' },
        { name: 'Nova Scotia', code: 'NS' },
        { name: 'New Brunswick', code: 'NB' },
        { name: 'Manitoba', code: 'MB' },
        { name: 'Saskatchewan', code: 'SK' },
        { name: 'Prince Edward Island', code: 'PE' },
        { name: 'Newfoundland and Labrador', code: 'NL' }
      ]
    },
    {
      name: 'United Kingdom',
      code: 'GB',
      states: [
        { name: 'England', code: 'ENG' },
        { name: 'Scotland', code: 'SCO' },
        { name: 'Wales', code: 'WAL' },
        { name: 'Northern Ireland', code: 'NIR' }
      ]
    },
    {
      name: 'Australia',
      code: 'AU',
      states: [
        { name: 'New South Wales', code: 'NSW' },
        { name: 'Victoria', code: 'VIC' },
        { name: 'Queensland', code: 'QLD' },
        { name: 'Western Australia', code: 'WA' },
        { name: 'South Australia', code: 'SA' },
        { name: 'Tasmania', code: 'TAS' },
        { name: 'Australian Capital Territory', code: 'ACT' },
        { name: 'Northern Territory', code: 'NT' }
      ]
    },
    {
      name: 'India',
      code: 'IN',
      states: [
        { name: 'Maharashtra', code: 'MH' },
        { name: 'Tamil Nadu', code: 'TN' },
        { name: 'Karnataka', code: 'KA' },
        { name: 'Uttar Pradesh', code: 'UP' },
        { name: 'West Bengal', code: 'WB' },
        { name: 'Andhra Pradesh', code: 'AP' },
        { name: 'Bihar', code: 'BR' },
        { name: 'Rajasthan', code: 'RJ' },
        { name: 'Gujarat', code: 'GJ' },
        { name: 'Punjab', code: 'PB' },
        { name: 'Haryana', code: 'HR' },
        { name: 'Kerala', code: 'KL' },
        { name: 'Odisha', code: 'OD' },
        { name: 'Madhya Pradesh', code: 'MP' },
        { name: 'Chhattisgarh', code: 'CG' }
      ]
    },
    {
      name: 'Germany',
      code: 'DE',
      states: [
        { name: 'Bavaria', code: 'BY' },
        { name: 'Berlin', code: 'BE' },
        { name: 'Hesse', code: 'HE' },
        { name: 'North Rhine-Westphalia', code: 'NW' },
        { name: 'Saxony', code: 'SN' },
        { name: 'Lower Saxony', code: 'NI' },
        { name: 'Baden-Württemberg', code: 'BW' },
        { name: 'Rhineland-Palatinate', code: 'RP' },
        { name: 'Thuringia', code: 'TH' },
        { name: 'Saarland', code: 'SL' }
      ]
    },
    {
      name: 'France',
      code: 'FR',
      states: [
        { name: 'Île-de-France', code: 'IDF' },
        { name: 'Provence-Alpes-Côte d\'Azur', code: 'PAC' },
        { name: 'Rhône-Alpes', code: 'RA' },
        { name: 'Normandy', code: 'NOR' },
        { name: 'Brittany', code: 'BRE' },
        { name: 'Aquitaine', code: 'AQU' },
        { name: 'Loire', code: 'LOI' },
        { name: 'Alsace', code: 'ALS' },
        { name: 'Languedoc-Roussillon', code: 'LR' }
      ]
    },
    {
      name: 'Italy',
      code: 'IT',
      states: [
        { name: 'Lazio', code: 'LAZ' },
        { name: 'Lombardy', code: 'LOM' },
        { name: 'Sicily', code: 'SIC' },
        { name: 'Campania', code: 'CAM' },
        { name: 'Tuscany', code: 'TOS' },
        { name: 'Emilia-Romagna', code: 'EMR' },
        { name: 'Veneto', code: 'VEN' },
        { name: 'Apulia', code: 'PUG' },
        { name: 'Calabria', code: 'CAL' },
        { name: 'Piedmont', code: 'PIE' }
      ]
    },
    {
      name: 'Spain',
      code: 'ES',
      states: [
        { name: 'Catalonia', code: 'CT' },
        { name: 'Andalusia', code: 'AN' },
        { name: 'Madrid', code: 'MD' },
        { name: 'Valencia', code: 'VC' },
        { name: 'Galicia', code: 'GA' },
        { name: 'Castile and León', code: 'CL' },
        { name: 'Basque Country', code: 'PV' },
        { name: 'Castilla-La Mancha', code: 'CM' },
        { name: 'Murcia', code: 'MC' },
        { name: 'Aragon', code: 'AR' }
      ]
    },
    {
      name: 'Mexico',
      code: 'MX',
      states: [
        { name: 'Jalisco', code: 'JA' },
        { name: 'Nuevo León', code: 'NL' },
        { name: 'CDMX', code: 'CDMX' },
        { name: 'Chihuahua', code: 'CH' },
        { name: 'Yucatan', code: 'YU' },
        { name: 'Puebla', code: 'PUE' },
        { name: 'Guanajuato', code: 'GTO' },
        { name: 'Michoacán', code: 'MIC' },
        { name: 'Oaxaca', code: 'OAX' },
        { name: 'Sonora', code: 'SON' }
      ]
    },
    {
      name: 'Brazil',
      code: 'BR',
      states: [
        { name: 'São Paulo', code: 'SP' },
        { name: 'Rio de Janeiro', code: 'RJ' },
        { name: 'Minas Gerais', code: 'MG' },
        { name: 'Bahia', code: 'BA' },
        { name: 'Paraná', code: 'PR' },
        { name: 'Rio Grande do Sul', code: 'RS' },
        { name: 'Pernambuco', code: 'PE' },
        { name: 'Ceará', code: 'CE' },
        { name: 'Pará', code: 'PA' },
        { name: 'Santa Catarina', code: 'SC' }
      ]
    },
    {
      name: 'Japan',
      code: 'JP',
      states: [
        { name: 'Tokyo', code: '13' },
        { name: 'Osaka', code: '27' },
        { name: 'Hokkaido', code: '01' },
        { name: 'Aichi', code: '23' },
        { name: 'Kyoto', code: '26' },
        { name: 'Fukuoka', code: '40' },
        { name: 'Chiba', code: '12' },
        { name: 'Kanagawa', code: '14' },
        { name: 'Hyogo', code: '28' },
        { name: 'Saitama', code: '11' }
      ]
    },
    {
      name: 'China',
      code: 'CN',
      states: [
        { name: 'Beijing', code: 'BJ' },
        { name: 'Shanghai', code: 'SH' },
        { name: 'Guangdong', code: 'GD' },
        { name: 'Sichuan', code: 'SC' },
        { name: 'Zhejiang', code: 'ZJ' },
        { name: 'Jiangsu', code: 'JS' },
        { name: 'Shandong', code: 'SD' },
        { name: 'Henan', code: 'HA' },
        { name: 'Hunan', code: 'HN' },
        { name: 'Anhui', code: 'AH' }
      ]
    },
    {
      name: 'Russia',
      code: 'RU',
      states: [
        { name: 'Moscow', code: 'MOW' },
        { name: 'Saint Petersburg', code: 'SPE' },
        { name: 'Sverdlovsk', code: 'SVE' },
        { name: 'Krasnoyarsk', code: 'KYA' },
        { name: 'Tatarstan', code: 'TA' },
        { name: 'Republic of Bashkortostan', code: 'BA' },
        { name: 'Krasnodar', code: 'KDA' },
        { name: 'Vladimir', code: 'VLA' },
        { name: 'Saratov', code: 'SAR' },
        { name: 'Volgograd', code: 'VGG' }
      ]
    },
    {
      name: 'South Korea',
      code: 'KR',
      states: [
        { name: 'Seoul', code: '11' },
        { name: 'Gyeonggi', code: '41' },
        { name: 'Busan', code: '26' },
        { name: 'Incheon', code: '28' },
        { name: 'Jeju', code: '49' },
        { name: 'Daegu', code: '27' },
        { name: 'Daejeon', code: '30' },
        { name: 'Ulsan', code: '31' }
      ]
    },
    {
      name: 'South Africa',
      code: 'ZA',
      states: [
        { name: 'Gauteng', code: 'GT' },
        { name: 'Western Cape', code: 'WC' },
        { name: 'KwaZulu-Natal', code: 'KZN' },
        { name: 'Eastern Cape', code: 'EC' },
        { name: 'Free State', code: 'FS' },
        { name: 'Limpopo', code: 'LP' },
        { name: 'Mpumalanga', code: 'MP' },
        { name: 'Northern Cape', code: 'NC' },
        { name: 'North West', code: 'NW' }
      ]
    },
    {
      name: 'New Zealand',
      code: 'NZ',
      states: [
        { name: 'Auckland', code: 'AUK' },
        { name: 'Wellington', code: 'WGN' },
        { name: 'Canterbury', code: 'CAN' },
        { name: 'Otago', code: 'OTA' },
        { name: 'Waikato', code: 'WKO' },
        { name: 'Bay of Plenty', code: 'BOP' },
        { name: 'Taranaki', code: 'TAR' },
        { name: 'Hawke\'s Bay', code: 'HKB' },
        { name: 'Manawatu-Wanganui', code: 'MW' }
      ]
    },
    {
      name: 'Argentina',
      code: 'AR',
      states: [
        { name: 'Buenos Aires', code: 'BA' },
        { name: 'Cordoba', code: 'C' },
        { name: 'Santa Fe', code: 'SF' },
        { name: 'Mendoza', code: 'M' },
        { name: 'Tucumán', code: 'TU' },
        { name: 'Entre Ríos', code: 'ER' },
        { name: 'Chaco', code: 'CHA' },
        { name: 'Misiones', code: 'M' },
        { name: 'Corrientes', code: 'COR' },
        { name: 'Salta', code: 'SA' }
      ]
    },
    {
      name: 'Colombia',
      code: 'CO',
      states: [
        { name: 'Antioquia', code: 'ANT' },
        { name: 'Cundinamarca', code: 'CUN' },
        { name: 'Valle del Cauca', code: 'VAC' },
        { name: 'Bogotá', code: 'BOG' },
        { name: 'Atlantico', code: 'ATL' },
        { name: 'Santander', code: 'SAN' },
        { name: 'Bolivar', code: 'BOL' },
        { name: 'Nariño', code: 'NAR' },
        { name: 'Tolima', code: 'TOL' },
        { name: 'Cesar', code: 'CES' }
      ]
    },
    {
      name: 'Chile',
      code: 'CL',
      states: [
        { name: 'Santiago', code: 'RM' },
        { name: 'Valparaíso', code: 'V' },
        { name: 'Antofagasta', code: 'AN' },
        { name: 'Maule', code: 'ML' },
        { name: 'Araucanía', code: 'AR' },
        { name: 'Los Lagos', code: 'LL' },
        { name: 'Coquimbo', code: 'CO' },
        { name: 'Los Rios', code: 'LR' },
        { name: 'O’Higgins', code: 'OH' }
      ]
    }
    // Add more countries as needed
  ];
  formSubmitted: boolean = false;

  selectedFileName: any;
  resumeformData: FormData = new FormData();;
  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required,
      Validators.pattern('[0-9]{10}')]],
      altPhone: ['', Validators.pattern('[0-9]{10}')],
      email: ['', [Validators.required, Validators.email]],
      altEmail: ['', Validators.email],
      state: ['', Validators.required],
      gender: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
      resume: ['', Validators.required],
      // specialty: ['', Validators.required],
      workAuth: ['authorized', Validators.required],
      githubURL: ['', Validators.pattern('(https?://)?(www.)?([a-zA-Z0-9-]+\\.){1,}([a-zA-Z]{2,22})(/[a-zA-Z0-9-]+)*(/)?')],
      linkedInURL: ['', Validators.pattern('(https?://)?(www.)?([a-zA-Z0-9-]+\\.){1,}([a-zA-Z]{2,22})(/[a-zA-Z0-9-]+)*(/)?')],
      experience: ['']
    });
  }
  onSubmit(): void {
    if (this.resumeForm.valid) {
      let _payloadObj = _.cloneDeep(this.resumeForm.value);
      if (!_payloadObj['address']) {
        _payloadObj['address'] = {};
      }
      let _resume = new FormData();
      _resume.append('resume', _payloadObj.resume);
      _payloadObj.address['country'] = _payloadObj.country;
      _payloadObj.address['state'] = _payloadObj.state;
      _payloadObj.address['zip'] = _payloadObj.zip;
      let address = ['country', 'state', 'zip'];
      Object.keys(_payloadObj).map((key) => {
        if (key != 'resume' && key != 'address' && address.indexOf(key) == -1) {
          _resume.append(key, _payloadObj[key])
        } else if (address.indexOf(key) > -1) {
          _resume.append('address.' + key, _payloadObj[key])
        }
      })
      this.serviceInvoker.invoke('post.submitresume', {}, _resume, {}).subscribe((res: any) => {
        console.log(this.resumeForm.value);
        this.resumeForm.reset({ workAuth: 'authorized' })
        this.notificationService.notify('Submitted sucessfully', "success");
        this.selectedFileName = null;
        this.formSubmitted = true
      }, (err: any) => {
        this.notificationService.notify('Something went wrong', 'errror');
      })
    } else {
      this.notificationService.notify('Mandatory fileds are missing', "warning");
      console.log('Form is invalid');
    }
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        this.selectedFileName = file.name;
        this.dropdownValues = {};
        this.resumeForm.patchValue({ resume: file });
        this.resumeformData.append('resume', this.resumeForm.get('resume')?.value);
      } else {
        this.notificationService.notify("Invalid file type. Only PDF and DOC/DOCX files are allowed.", "warning");
        console.log('Invalid file type. Only PDF and DOC/DOCX files are allowed.');
        this.selectedFileName = null;
        this.resumeForm.patchValue({ resume: null });
      }
    }
  }
  private isValidFileType(file: File): boolean {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  }

  dropdownValueSelection(type: any, value: any) {
    if (!this.dropdownValues[type]) {
      this.dropdownValues[type] = {}
    }
    this.dropdownValues[type] = value;
  }

  clearFile(fileInput: HTMLInputElement): void {
    fileInput.value = ''; this.selectedFileName = null;
    this.resumeForm.patchValue({ resume: null });
  }
}
