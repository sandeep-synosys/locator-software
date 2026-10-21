import { getJob } from '@/components/about/career/jobs-data'
import { sendMail } from '@/lib/email/send-mail'
import { careerApplicationTemplate } from '@/lib/email/templates/career-application'
import { verifyTurnstile } from '@/lib/turnstile'

export const runtime = 'nodejs'

const MAX_RESUME_BYTES = 5 * 1024 * 1024
const MAX_REQUEST_BYTES = 6 * 1024 * 1024
const RESUME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
}
const failure = (error: string, status = 400) => Response.json({ success: false, error }, { status })

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.startsWith('multipart/form-data;')) {
    return failure('Please submit the application using the form.')
  }
  
  const CAREER_RECIPIENT_EMAIL = process.env.CAREER_RECIPIENT_EMAIL || 'careers@locator.ae'
  if (!CAREER_RECIPIENT_EMAIL) {
    console.error('CAREER_RECIPIENT_EMAIL environment variable is missing.')
    return failure('Unable to process your application. Please try again later.', 500)
  }

  // Bound the multipart body as it arrives, including requests without Content-Length.
  let form: FormData
  try {
    const reader = request.body?.getReader()
    if (!reader) return failure('The application is empty.')
    const chunks: Uint8Array[] = []
    let bytes = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_REQUEST_BYTES) {
        await reader.cancel()
        return failure('The application is too large. Resume files must be no larger than 5 MB.', 413)
      }
      chunks.push(value)
    }
    form = await new Request(request.url, {
      method: 'POST', headers: { 'content-type': contentType }, body: Buffer.concat(chunks),
    }).formData()
  } catch {
    return failure('Unable to read your application. Please try again.')
  }

  const text = (key: string) => {
    const value = form.get(key)
    return typeof value === 'string' ? value.trim() : ''
  }
  const job = getJob(text('jobSlug'))
  if (!job) return failure('This position is unavailable. Please choose a listed job.')

  const firstName = text('firstName')
  const lastName = text('lastName')
  const email = text('email')
  const countryCode = text('countryCode')
  const phone = text('phone')
  const coverLetter = text('coverLetter')
  const onsite = text('onsite')
  const salary = text('salary')
  const screeningAnswer = text('screening')
  const address = text('address')
  const experienceValues = form.getAll('experience')
  
  if (![firstName, lastName, email, countryCode, phone, onsite, salary].every(Boolean)) {
    return failure('Please complete all required fields.')
  }
  if (email.length > 254 || !/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(email)) {
    return failure('Please enter a valid email address.')
  }
  if (!/^\+\d{1,4}$/.test(countryCode) || !/^[\d\s().+-]{4,30}$/.test(phone)) {
    return failure('Please enter a valid phone number and country code.')
  }
  if (!['yes', 'no'].includes(screeningAnswer)) return failure('Please answer the screening question.')
  if ([firstName, lastName].some(value => value.length > 100 || /[\r\n]/.test(value)) ||
      address.length > 500 || coverLetter.length > 10000 || onsite.length > 2000 || salary.length > 500 ||
      experienceValues.length > 20 || experienceValues.some(value => typeof value !== 'string' || value.length > 1000)) {
    return failure('Some application details are too long. Please shorten them and try again.')
  }

  const resume = form.get('resume')
  if (!(resume instanceof File) || !resume.size) return failure('Please attach your resume.')
  if (resume.size > MAX_RESUME_BYTES) return failure('Your resume must be no larger than 5 MB.', 413)
  const extension = resume.name.split('.').pop()?.toLowerCase() || ''
  if (!RESUME_TYPES[extension]) return failure('Please upload a PDF, DOC, DOCX, ODT, or RTF resume.')

  const verification = await verifyTurnstile(form, 'career_application')
  if (!verification.success) return failure(verification.error, 400)

  try {
    await sendMail({
      to: CAREER_RECIPIENT_EMAIL,
      fromName: 'Career Applications',
      replyTo: email,
      subject: `Job application: ${job.title} — ${firstName} ${lastName}`,
      html: careerApplicationTemplate({
        jobTitle: job.title, jobLocation: job.location, firstName, lastName, email,
        phone: `${countryCode} ${phone}`, address,
        experiences: experienceValues.map(value => String(value).trim()).filter(Boolean),
        coverLetter, onsite, salary, screeningQuestion: job.screeningQuestion, screeningAnswer,
      }),
      attachments: [{
        filename: resume.name.replace(/[\\/\x00-\x1f\x7f]/g, '_').slice(-120),
        content: Buffer.from(await resume.arrayBuffer()),
        contentType: RESUME_TYPES[extension],
      }],
    })
    return Response.json({ success: true })
  } catch {
    console.error('Career application email could not be sent.')
    return failure('Unable to send your application. Please try again or contact careers@locator.ae.', 500)
  }
}
