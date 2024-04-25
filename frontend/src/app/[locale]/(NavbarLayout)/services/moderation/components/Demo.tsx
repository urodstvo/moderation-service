'use client';

import { IconChevronDown } from '@tabler/icons-react';
import React from 'react';
import { create } from 'zustand';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const useLanguageStore = create<{
    language: 'ru' | 'en';
    setLanguage: (language: 'ru' | 'en') => void;
}>((set) => ({
    language: 'en',
    setLanguage: (language: 'ru' | 'en') => set({ language }),
}));

const useInputTypeStore = create<{
    type: 'text' | 'audio' | 'image' | 'video';
    setType: (type: 'text' | 'audio' | 'image' | 'video') => void;
}>((set) => ({
    type: 'text',
    setType: (type: 'text' | 'audio' | 'image' | 'video') => set({ type }),
}));

const LanguageInput = React.memo(() => {
    const { language, setLanguage } = useLanguageStore();
    return (
        <div>
            <label htmlFor='inputlanguage' className='font-roboto text-[16px] leading-5'>
                Language
            </label>
            <Select defaultValue={language} onValueChange={setLanguage}>
                <SelectTrigger className='w-60' id='inputlanguage'>
                    <SelectValue className='!font-roboto !text-xl' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='ru'>Russian</SelectItem>
                        <SelectItem value='en'>English</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
});

const TypeInput = React.memo(() => {
    const { type, setType } = useInputTypeStore();
    return (
        <div>
            <label htmlFor='inputtype' className='font-roboto text-[16px] leading-5'>
                Input Type
            </label>
            <Select defaultValue={type} onValueChange={setType}>
                <SelectTrigger className='w-60' id='inputtype'>
                    <SelectValue className='!font-roboto !text-xl' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='text'>Text</SelectItem>
                        <SelectItem value='image'>Image</SelectItem>
                        <SelectItem value='audio'>Audio</SelectItem>
                        <SelectItem value='video'>Video</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
});

export const Demo = () => {
    const { language } = useLanguageStore();
    const { type } = useInputTypeStore();
    return (
        <section className='flex flex-col gap-5' id='demo'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>Test Out The Moderation API</h3>
            <div className='w-[600px] flex flex-col gap-5'>
                <div className='flex justify-between'>
                    <TypeInput />
                    {type !== 'text' && <LanguageInput />}
                </div>
                {type === 'text' && (
                    <Textarea
                        placeholder='Write here something'
                        className='w-full resize-none font-roboto text-[16px] leading-5'
                        rows={10}
                    />
                )}
                {type === 'image' && <Input type='file' accept='image/*' />}
                {type === 'audio' && <Input type='file' accept='audio/wav' />}
                {type === 'video' && <Input type='file' accept='video/mp4,video/x-m4v,video/*' />}

                <Collapsible>
                    <div className='flex items-center justify-between'>
                        <CollapsibleTrigger asChild>
                            <Button variant='outline' className='font-roboto'>
                                Show Response <IconChevronDown stroke={1.5} size={24} />
                            </Button>
                        </CollapsibleTrigger>
                        <Button className='w-40 font-roboto font-medium text-xl'>Analyze</Button>
                    </div>
                    <CollapsibleContent>
                        <pre>asdasd</pre>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
    );
};

//TODO: add request logic for button
