'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { create } from 'zustand';

import { useFileModerationMutation, useTextModerationMutation } from '@/api';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const useLanguageStore = create<{
    language: 'rus' | 'eng';
    setLanguage: (language: 'rus' | 'eng') => void;
}>((set) => ({
    language: 'eng',
    setLanguage: (language: 'rus' | 'eng') => set({ language }),
}));

const useInputTypeStore = create<{
    type: 'text' | 'audio' | 'image' | 'video';
    setType: (type: 'text' | 'audio' | 'image' | 'video') => void;
}>((set) => ({
    type: 'text',
    setType: (type: 'text' | 'audio' | 'image' | 'video') => set({ type }),
}));

// eslint-disable-next-line react/display-name
const LanguageInput = React.memo(() => {
    const t = useTranslations('services.demo');
    const { language, setLanguage } = useLanguageStore();
    return (
        <div>
            <label htmlFor='inputlanguage' className='font-roboto text-2xl leading-5'>
                {t('language')}
            </label>
            <Select defaultValue={language} onValueChange={setLanguage}>
                <SelectTrigger className='w-60 text-xl text-bold' id='inputlanguage'>
                    <SelectValue className='!font-roboto !text-xl' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='rus'>Русский</SelectItem>
                        <SelectItem value='eng'>English</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
});

// eslint-disable-next-line react/display-name
const TypeInput = React.memo(() => {
    const t = useTranslations('services.demo');
    const { type, setType } = useInputTypeStore();
    return (
        <div>
            <label htmlFor='inputtype' className='font-roboto text-2xl leading-5'>
                {t('type')}
            </label>
            <Select defaultValue={type} onValueChange={setType}>
                <SelectTrigger className='w-60 !text-xl !text-bold' id='inputtype'>
                    <SelectValue className='!font-roboto !text-xl !text-bold' />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='text'>{t('text')}</SelectItem>
                        <SelectItem value='image'>{t('image')}</SelectItem>
                        <SelectItem value='audio'>{t('audio')}</SelectItem>
                        <SelectItem value='video'>{t('video')}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
});

export const Demo = () => {
    const t = useTranslations('services.demo');
    const { language } = useLanguageStore();
    const { type } = useInputTypeStore();
    const [text, setText] = React.useState<string>('');
    const [image, setImage] = React.useState<File>();
    const [audio, setAudio] = React.useState<File>();
    const [video, setVideo] = React.useState<File>();

    const textModeration = useTextModerationMutation();
    const fileModeration = useFileModerationMutation();

    const handleAnalyze = () => {
        if (type === 'text') {
            textModeration.mutate({ text, lang: 'auto' });
        } else {
            const file = type === 'image' ? image : type === 'audio' ? audio : video;
            const data = new FormData();
            data.append('file', file as File);
            data.append('lang', language);
            fileModeration.mutate({ type, data });
        }
    };

    return (
        <section className='flex flex-col gap-5' id='demo'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>{t('title')}</h3>
            <div className='w-[600px] flex flex-col gap-5'>
                <div className='flex justify-between'>
                    <TypeInput />
                    {type !== 'text' && <LanguageInput />}
                </div>
                {type === 'text' && (
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.currentTarget.value)}
                        placeholder='Write here something'
                        className='w-full resize-none font-roboto text-2xl leading-5'
                        rows={10}
                    />
                )}
                {type === 'image' && (
                    <Input type='file' accept='image/*' onChange={(e) => setImage(e.target.files?.[0])} />
                )}
                {type === 'audio' && (
                    <Input type='file' accept='audio/*' onChange={(e) => setAudio(e.target.files?.[0])} />
                )}
                {type === 'video' && (
                    <Input
                        type='file'
                        accept='video/mp4,video/x-m4v,video/*'
                        onChange={(e) => setVideo(e.target.files?.[0])}
                    />
                )}

                <Collapsible>
                    <div className='flex items-center justify-between'>
                        <CollapsibleTrigger asChild>
                            <Button variant='outline' className='font-roboto text-xl '>
                                {t('show')} <IconChevronDown stroke={1.5} size={24} />
                            </Button>
                        </CollapsibleTrigger>
                        <Button className='w-40 font-roboto font-medium text-xl' onClick={handleAnalyze}>
                            {t('analyze')}
                        </Button>
                    </div>
                    <CollapsibleContent>
                        <pre className='whitespace-pre-wrap'>
                            {type === 'text' && (
                                <>
                                    {textModeration.isSuccess && JSON.stringify(textModeration.data.data, undefined, 2)}
                                    {textModeration.isPending && <div>Loading...</div>}
                                </>
                            )}
                            {type !== 'text' && (
                                <>
                                    {fileModeration.isSuccess && JSON.stringify(fileModeration.data.data, undefined, 2)}
                                    {fileModeration.isPending && <div>Loading...</div>}
                                </>
                            )}
                        </pre>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </section>
    );
};
