import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberBackground } from './cyber-background';

describe('CyberBackground', () => {
  let component: CyberBackground;
  let fixture: ComponentFixture<CyberBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyberBackground],
    }).compileComponents();

    fixture = TestBed.createComponent(CyberBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
