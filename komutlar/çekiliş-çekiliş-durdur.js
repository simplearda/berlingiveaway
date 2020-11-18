const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("ms");

exports.run = async (client, message, args) => {
   if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Bu Komutu Kullanabilmek İçin **YÖNETİCİ** Yetkisine Sahip Olman Gerek.")
      function cekme(message, array) {
      var eskikazananlar = db.fetch(`cekilis_${message.id}.kazananlar`) || []
      var cekilenkisi = array[Math.floor(Math.random() * array.length)]
      if (!client.users.cache.get(cekilenkisi.id)) {
        return cekme(message, array)
      }
      if (cekilenkisi.id == client.user.id) {
        return cekme(message, array)
      }
      while (eskikazananlar.includes(cekilenkisi.id)) {
        return cekme(message, array)
      }
      if (!eskikazananlar.includes(cekilenkisi.id)) {
        if (db.has(`cekilis_${message.id}.kazananlar`)) {
          db.push(`cekilis_${message.id}.kazananlar`, cekilenkisi.id)
        }else{
          db.set(`cekilis_${message.id}.kazananlar`, [cekilenkisi.id])
        }
      }
    }
  
 

   const cekilisid = args[0]
   if (!cekilisid) return message.reply('Bir çekiliş IDsi belirtmeniz gerek.')
   
   if (!db.has(`cekilisidsi_${cekilisid}`)) return message.reply('Doğru bir çekiliş IDsi belirtmeniz gerek.')
   
   client.channels.cache.get(db.fetch(`cekilisidsi_${cekilisid}.mesaj.kanal`)).messages.fetch(db.fetch(`cekilisidsi_${cekilisid}.mesaj.id`)).then(async msg => {
     
      if (!db.has(`cekilis_${msg.id}`)) return message.reply('Bu çekiliş zaten bitmiş.')
     
    msg.delete()
    db.delete(`cekilis_${msg.id}`)
    let all = db.all().filter(i => i.ID.includes(msg.id))
    for (const uu of all) {
       db.delete(uu.ID)
    }
    message.reply('Çekiliş başarıyla durduruldu.')
    })
   
 
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'çekilişdurdur',
  description: 'Bot adminlerinin bot üzerinde kod test etmesini sağlar.',
  usage: 'eval <kod>'
};