
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Calendar, Clock } from 'lucide-react';

const LocationDetailsStep = () => {
  const { control, register, setValue, watch } = useFormContext();
  const date = watch('date');
  const currentDate = new Date();

  // Helper function for formatting dates
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Set current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you might convert coordinates to an address
          const locationString = `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`;
          setValue('location', locationString, { shouldDirty: true });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Set current date
  const useCurrentDate = () => {
    setValue('date', new Date(), { shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Location & Details</h2>

      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="location">Where did this happen?</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={useCurrentLocation}
            className="flex items-center"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Use Current
          </Button>
        </div>
        <Input 
          id="location"
          placeholder="Enter location or address"
          className="h-12 text-base"
          {...register('location')} 
        />
      </div>

      {/* Date & Time */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel htmlFor="date">When?</FormLabel>
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={useCurrentDate}
              className="flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>
        </div>
        <Input 
          id="date"
          type="date"
          className="h-12 text-base"
          value={date instanceof Date ? formatDate(date) : ''}
          onChange={(e) => {
            setValue('date', new Date(e.target.value), { shouldDirty: true });
          }}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <FormLabel htmlFor="description">Brief Description</FormLabel>
        <Textarea 
          id="description"
          placeholder="Describe what happened (max 280 characters)"
          className="resize-none min-h-[100px] text-base"
          maxLength={280}
          {...register('description')}
        />
        <div className="text-sm text-muted-foreground text-right">
          {watch('description')?.length || 0}/280
        </div>
      </div>

      {/* Injury Question */}
      <div className="space-y-2">
        <FormLabel>Was anyone injured?</FormLabel>
        <FormField
          control={control}
          name="isInjury"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === 'true')}
                  defaultValue={field.value ? 'true' : 'false'}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="injury-yes" />
                    <FormLabel htmlFor="injury-yes" className="cursor-pointer">Yes</FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="injury-no" />
                    <FormLabel htmlFor="injury-no" className="cursor-pointer">No</FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LocationDetailsStep;
